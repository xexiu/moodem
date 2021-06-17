// @ts-ignore
import ytdl from 'react-native-ytdl';
import { isEmpty } from '../../../Utils/common/checkers';
import { hasObjWithProp } from '../../../Utils/common/checkers';
import firebase from '../services/firebase';

export function cleanVideoTitle(info: any) {
    if (info && info.details && info.details.title) {
        info.details.title = info.details.title.replace('(Official Music Video)', '')
            .replace('(Official Video)', '');
        return info.details.title;
    }
    return info.details.title;
}

export function cleanVideoImageParams(audio: any) {
    if (audio.details && audio.details.thumbnails.length) {
        if (audio.details.thumbnails[0].url.indexOf('hqdefault.jpg') >= 0) {
            audio.details.thumbnails[0].url = audio.details.thumbnails[0].url.replace(/(\?.*)/g, '');
            return audio.details.thumbnails[0].url;
        }
    }
    return audio.details.thumbnails[0].url;
}

export function checkIfAlreadyOnList(songs: string[], searchedSongs: string[]) {
    songs.filter((song: any) => {
        return !searchedSongs.some((searchedSong: any) => {
            if (song.id === searchedSong.id && song.isMediaOnList) {
                Object.assign(searchedSong, {
                    isMediaOnList: true
                });
            }
        });
    });
}

export async function convertVideoIdYtdl(videoId: string) {
    const info = await ytdl.getInfo(videoId);
    const audio = info.formats.filter((format: any) => format.hasAudio && format.hasVideo);

    if (audio && audio.length) {
        // tslint:disable-next-line:forin
        for (const attr in audio[0]) {
            if (attr !== 'url') {
                delete audio[0][attr];
            }
        }

        Object.assign(audio[0], {
            id: info.videoDetails.videoId,
            details: info.videoDetails
        });

        cleanVideoImageParams(audio[0]);
        cleanVideoTitle(audio[0]);

        return { ...audio[0] };
    }

    return {};
}

export async function convertVideoIdsFromDB(songs: [] = []) {
    try {
        const audios = await Promise.all(songs.map(async (song: any) => {
            const convertedSong = await convertVideoIdYtdl(song.id);
            Object.assign(song, {
                ...convertedSong,
                voted_users: song.voted_users || [],
                boosted_users: song.boosted_users || []
            });
            return song;
        }));
        return audios;
    } catch (error) {
        console.error('Error convertVideoIdsFromDB', JSON.stringify(error));
    }
}

export const saveSongOnDb = async (song: any, user: any, group: any) => {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${groupName}/${group.group_id}`);
    const dbgroup = await refGroup.once('value');
    const _group = await dbgroup.val();
    if (_group.group_songs && !hasObjWithProp(_group, 'group_songs', { id: song.id })) {
        _group.group_songs.push(song);
    } else {
        _group.group_songs = [];
        _group.group_songs.push(song);
    }

    if (_group.group_users && !hasObjWithProp(_group, 'group_users', { user_uid: user.uid })) {
        _group.group_users.push({
            user_uid: user.uid,
            group_owner: _group.user_owner_id === user.uid,
            group_admin: _group.user_owner_id === user.uid
        });
    } else {
        _group.group_users = [];
        _group.group_users.push({
            user_uid: user.uid,
            group_owner: _group.user_owner_id === user.uid,
            group_admin: _group.user_owner_id === user.uid
        });
    }

    return refGroup.update(_group);
};

export const updateSongExpiredOnDB = (song: any, user: any, groupName: string, cb?: Function) => {
    const _groupName = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${_groupName}`);

    return refGroup.once('value', (snapshot: any) => {
        const group = Object.assign({}, ...Object.values(snapshot.val() || []));

        if (group.group_songs) {
            const indexInArray = group.group_songs.findIndex((dbSong: any) => dbSong.id === song.id);
            group.group_songs.splice(indexInArray, 1, song);
        } else {
            group.group_songs = [];
        }

        refGroup.child(Object.keys(snapshot.val())[0]).set(group);
    })
        .then(cb);
};

export const saveVotesForSongOnDb = async (song: any, user: any, group: any) => {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${groupName}/${group.group_id}`);
    const dbgroup = await refGroup.once('value');
    const _group = await dbgroup.val();
    const dbGroupSongs = _group.group_songs;

    const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
    const groupSongs = dbGroupSongs[indexInArray];

    if (!isEmpty(groupSongs.voted_users)) {
        const userHasVoted = groupSongs.voted_users.some((id: number) => id === user.uid);

        if (groupSongs.id === song.id && !userHasVoted) {
            if (groupSongs.voted_users.indexOf(user.uid) === -1) {
                groupSongs.voted_users.push(user.uid);
            }
        }
    } else {
        groupSongs.voted_users = [];
        groupSongs.voted_users.push(user.uid);
    }

    dbGroupSongs.sort((a: any, b: any) => {
        if (!a.voted_users || !a.boosted_users) {
            Object.assign(a, {
                voted_users: a.voted_users || [],
                boosted_users: a.boosted_users || []
            });
        }
        if (!b.voted_users || b.boosted_users) {
            Object.assign(b, {
                voted_users: b.voted_users || [],
                boosted_users: b.boosted_users || []
            });
        }
        return b.voted_users.length - a.voted_users.length;
    });

    return refGroup.update(_group);
};

export const removeSongFromDB = async(song: any, user: any, group: any) => {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${groupName}/${group.group_id}`);
    const dbgroup = await refGroup.once('value');
    const _group = await dbgroup.val();
    const dbGroupSongs = _group.group_songs;

    if (!isEmpty(dbGroupSongs)) {
        const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
        dbGroupSongs.splice(indexInArray, 1);
    }

    return refGroup.update(_group);
};
