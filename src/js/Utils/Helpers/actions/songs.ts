// @ts-ignore
import ytdl from 'react-native-ytdl';
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

export const saveSongOnDb = (song: any, user: any, groupName: string, cb?: Function) => {
    const _groupName = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${_groupName}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = Object.assign({}, ...Object.values(snapshot.val() || []));

        if (dbgroup.group_songs) {
            dbgroup.group_songs.push(song);
        } else {
            dbgroup.group_songs = [song];
        }

        if (dbgroup.group_users) {
            dbgroup.group_users.push({
                user_uid: user.uid,
                group_owner: false,
                group_admin: false
            });
        } else {
            dbgroup.group_users = [{
                user_uid: user.uid,
                group_owner: false,
                group_admin: false
            }];
        }
        // tslint:disable-next-line:max-line-length
        dbgroup.group_users = [...new Map(dbgroup.group_users.map((groupUser: any) => [groupUser.user_uid, groupUser])).values()];
        // tslint:disable-next-line:max-line-length
        dbgroup.group_songs = [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];

        refGroup.child(Object.keys(snapshot.val())[0]).set(dbgroup);
    })
        .then(cb);
};

export const updateSongExpiredOnDB = (song: any, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = Object.assign({}, ...Object.values(snapshot.val() || []));
        const dbGroupSongs = dbgroup.group_songs;

        if (dbGroupSongs) {
            const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
            const songDB = dbGroupSongs[indexInArray];

            if (songDB) {
                if (songDB.id === song.id) {
                    Object.assign(songDB, {
                        url: song.url,
                        hasExpired: false
                    });
                }
            }
        } else {
            Object.assign(dbGroupSongs, []);
        }

        // tslint:disable-next-line:max-line-length
        dbgroup.group_songs = [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.url, groupSong])).values()];

        refGroup.child(Object.keys(snapshot.val())[0]).set(dbgroup);
    })
        .then(cb);
};

export const saveVotesForSongOnDb = (song: any, user: any, groupName: string, cb?: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = Object.assign({}, ...Object.values(snapshot.val() || []));
        const indexInArray = dbgroup.group_songs.findIndex((dbSong: any) => dbSong.id === song.id);
        const groupSongs = dbgroup.group_songs[indexInArray];

        if (groupSongs.voted_users) {
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

        // tslint:disable-next-line:max-line-length
        dbgroup.group_songs = [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];

        dbgroup.group_songs.sort((a: any, b: any) => {
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

        refGroup.child(Object.keys(snapshot.val())[0]).set(dbgroup);
    })
        .then(cb);
};

export const removeSongFromDB = (song: any, user: any, groupName: string, cb?: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = Object.assign({}, ...Object.values(snapshot.val() || []));
        const dbGroupSongs = dbgroup.group_songs;

        if (dbGroupSongs.length) {
            const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
            dbGroupSongs.splice(indexInArray, 1);
        }

        refGroup.child(Object.keys(snapshot.val())[0]).set(dbgroup);
    })
        .then(cb);
};
