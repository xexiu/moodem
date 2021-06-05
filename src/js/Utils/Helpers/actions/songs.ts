// @ts-ignore
import ytdl from 'react-native-ytdl';
import firebase from '../services/firebase';

const compareValues = (key: string) => (a: any, b: any) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
    }

    const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

    if (varA > varB) {
        return -1;
    }
    if (varA < varB) {
        return 1;
    }

    return 0;
};

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

export const saveSongOnDb = (song: any, user: any, groupName: string, cb?: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];

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

        refGroup.update({
            // tslint:disable-next-line:max-line-length
            group_users: [...new Map(dbgroup.group_users.map((groupUser: any) => [groupUser.user_uid, groupUser])).values()],
            // tslint:disable-next-line:max-line-length
            group_songs: [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()]
        });
    })
        .then(cb);
};

export const updateSongExpiredOnDB = (song: any, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];
        const dbGroupSongs = dbgroup.group_songs;
        const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
        const songDB = dbGroupSongs[indexInArray];

        if (songDB.id === song.id) {
            Object.assign(songDB, {
                url: song.url,
                hasExpired: false
            });
        }

        refGroup.update({
            // tslint:disable-next-line:max-line-length
            group_songs: [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.url, groupSong])).values()]
        });
    })
        .then(cb);
};

export const saveVotesForSongOnDb = (song: any, user: any, groupName: string, cb?: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];
        const dbGroupSongs = dbgroup.group_songs;
        const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
        const songDB = dbGroupSongs[indexInArray];

        if (songDB.voted_users) {
            const userHasVoted = songDB.voted_users.some((id: number) => id === user.uid);

            if (songDB.id === song.id && !userHasVoted) {
                songDB.votes_count = ++songDB.votes_count;
                songDB.voted_users.push(user.uid);
            }
        } else {
            songDB.voted_users = [];
            songDB.votes_count = ++songDB.votes_count;
            songDB.voted_users.push(user.uid);
        }

        dbgroup.group_songs.sort(compareValues('votes_count'));

        refGroup.update({
            // tslint:disable-next-line:max-line-length
            group_songs: [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.id, groupSong])).values()]
        });
    })
        .then(cb);
};

export const removeSongFromDB = (song: any, user: any, groupName: string, cb?: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];
        const dbGroupSongs = dbgroup.group_songs;

        if (dbGroupSongs.length) {
            const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
            dbGroupSongs.splice(indexInArray, 1);
        }

        refGroup.update({
            group_songs: [...new Set(dbGroupSongs || [])]
        });
    })
        .then(cb);
};
