// @ts-ignore
import ytdl from 'react-native-ytdl';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../common/storageConfig';
import firebase from '../services/firebase';

const ONE_DAY = 1000 * 3600 * 24;
const NINTY_DAYS = ONE_DAY * 90;

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
        // send error to sentry or other server
        console.log('Error convertVideoIdsFromDB', error);
    }
}

export const saveSongOnLocalStorage = async (song: any, user: any, groupName: string) => {
    const groupsLocalStorage = await loadFromLocalStorage(user.uid);

    if (groupsLocalStorage instanceof Array) {
        const index = groupsLocalStorage.findIndex(groupLocal => groupLocal.group_name === groupName);

        const groupLocalStorage = groupsLocalStorage[index];

        if (groupLocalStorage.group_songs) {
            groupLocalStorage.group_songs.push(song);
        } else {
            groupLocalStorage.group_songs = [song];
        }

        if (groupLocalStorage.group_users) {
            groupLocalStorage.group_users.push({
                user_uid: user.uid,
                group_owner: false,
                group_admin: false
            });
        } else {
            groupLocalStorage.group_users = [{
                user_uid: user.uid,
                group_owner: false,
                group_admin: false
            }];
        }

        // tslint:disable-next-line:max-line-length
        groupLocalStorage.group_users = [...new Map(groupLocalStorage.group_users.map((groupUser: any) => [groupUser.user_uid, groupUser])).values()];
        // tslint:disable-next-line:max-line-length
        groupLocalStorage.group_songs = [...new Map(groupLocalStorage.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];
        await saveOnLocalStorage(user.uid, groupsLocalStorage, NINTY_DAYS);
    }
};

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

export const updateSongExipredOnLocalStorage = async (song: any, user: any, groupName: string) => {
    const groups = await loadFromLocalStorage(user.uid);

    if (groups instanceof Array) {
        const index = groups.findIndex(_group => _group.group_name === groupName);
        const group = groups[index];
        const groupSongs = group.group_songs;
        const indexInArray = groupSongs.findIndex((groupSong: any) => groupSong.id === song.id);
        const songLocal = groupSongs[indexInArray];

        if (songLocal.id === song.id) {
            Object.assign(songLocal, {
                url: song.url,
                hasExpired: false
            });
        }

        // tslint:disable-next-line:max-line-length
        group.group_songs = [...new Map(group.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];
        await saveOnLocalStorage(user.uid, groups, NINTY_DAYS);
    }
};

export const updateSongExpiredOnDB = (song: any, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = Object.assign({}, ...Object.values(snapshot.val() || []));
        const dbGroupSongs = dbgroup.group_songs;
        const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
        const songDB = dbGroupSongs[indexInArray];

        if (songDB.id === song.id) {
            Object.assign(songDB, {
                url: song.url,
                hasExpired: false
            });
        }

        // tslint:disable-next-line:max-line-length
        dbgroup.group_songs = [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.url, groupSong])).values()];

        refGroup.child(Object.keys(snapshot.val())[0]).set(dbgroup);
    })
        .then(cb);
};

export const saveVotesForSongOnLocalStorage = async (song: any, user: any, groupName: string) => {
    const groups = await loadFromLocalStorage(user.uid);

    if (groups instanceof Array) {
        const index = groups.findIndex(_group => _group.group_name === groupName);
        const group = groups[index];
        const groupSongs = group.group_songs;
        const indexInArray = groupSongs.findIndex((groupSong: any) => groupSong.id === song.id);
        const songLocal = groupSongs[indexInArray];

        if (songLocal.voted_users) {
            const userHasVoted = songLocal.voted_users.some((id: number) => id === user.uid);

            if (songLocal.id === song.id && !userHasVoted) {
                if (songLocal.voted_users.indexOf(user.uid) === -1) {
                    songLocal.voted_users.push(user.uid);
                }
            }
        } else {
            songLocal.voted_users = [];
            songLocal.voted_users.push(user.uid);
        }

        group.group_songs.forEach((_song: any) => Object.assign(_song, {
            voted_users: _song.voted_users || [],
            boosted_users: _song.boosted_users || []
        }));

        // tslint:disable-next-line:max-line-length
        group.group_songs = [...new Map(group.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];
        group.group_songs.sort((a: any, b: any) => {
            return b.voted_users.length - a.voted_users.length;
        });

        await saveOnLocalStorage(user.uid, groups, NINTY_DAYS);
    }
};

export const saveVotesForSongOnDb = (song: any, user: any, groupName: string, cb?: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = Object.assign({}, ...Object.values(snapshot.val() || []));
        const indexInArray = dbgroup.group_songs.findIndex((dbSong: any) => dbSong.id === song.id);
        const songDB = dbgroup.group_songs[indexInArray];

        if (songDB.voted_users) {
            const userHasVoted = songDB.voted_users.some((id: number) => id === user.uid);

            if (songDB.id === song.id && !userHasVoted) {
                if (songDB.voted_users.indexOf(user.uid) === -1) {
                    songDB.voted_users.push(user.uid);
                }
            }
        } else {
            songDB.voted_users = [];
            songDB.voted_users.push(user.uid);
        }

        dbgroup.group_songs.forEach((_song: any) => Object.assign(_song, {
            voted_users: _song.voted_users || [],
            boosted_users: _song.boosted_users || []
        }));

        // tslint:disable-next-line:max-line-length
        dbgroup.group_songs = [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];

        dbgroup.group_songs.sort((a: any, b: any) => {
            return b.voted_users.length - a.voted_users.length;
        });

        refGroup.child(Object.keys(snapshot.val())[0]).set(dbgroup);
    })
        .then(cb);
};

export const removeSongFromLocalStorage = async (song: any, user: any, groupName: string) => {
    const groupsLocalStorage = await loadFromLocalStorage(user.uid);

    if (groupsLocalStorage instanceof Array) {
        const index = groupsLocalStorage.findIndex(groupLocal => groupLocal.group_name === groupName);

        const groupLocalStorage = groupsLocalStorage[index];

        if (groupLocalStorage.group_songs.length) {
            const indexInArray = groupLocalStorage.group_songs.findIndex((groupSong: any) => groupSong.id === song.id);
            groupLocalStorage.group_songs.splice(indexInArray, 1);
        }
        // tslint:disable-next-line:max-line-length
        groupLocalStorage.group_songs = [...new Map(groupLocalStorage.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()];
        await saveOnLocalStorage(user.uid, groupsLocalStorage, NINTY_DAYS);
    }
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
