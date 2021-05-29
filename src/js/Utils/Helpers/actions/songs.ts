import chunk from 'lodash';
// @ts-ignore
import ytdl from 'react-native-ytdl';
import firebase from '../services/firebase';

export function cleanVideoTitle(info: any) {
    if (info && info.videoDetails && info.videoDetails.title) {
        info.videoDetails.title = info.videoDetails.title.replace('(Official Music Video)', '')
            .replace('(Official Video)', '');
        return info.videoDetails.title;
    }
    return info.videoDetails.title;
}

export function cleanVideoImageParams(audio: any) {
    if (audio.videoDetails && audio.videoDetails.thumbnails.length) {
        if (audio.videoDetails.thumbnails[0].url.indexOf('hqdefault.jpg') >= 0) {
            audio.videoDetails.thumbnails[0].url = audio.videoDetails.thumbnails[0].url.replace(/(\?.*)/g, '');
            return audio.videoDetails.thumbnails[0].url;
        }
    }
    return audio.videoDetails.thumbnails[0].url;
}

export function checkIfAlreadyOnList(songs: string[], searchedSongs: string[]) {
    songs.filter((song: any) => {
        return !searchedSongs.some((searchedSong: any) => {
            if (song.videoDetails.videoId === searchedSong.videoDetails.videoId && song.isMediaOnList) {
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
            videoDetails: info.videoDetails
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
            const convertedSong = await convertVideoIdYtdl(song.videoDetails.videoId);
            Object.assign(song, convertedSong);
            return song;
        }));
        return audios;
    } catch (error) {
        // send error to sentry or other server
        console.log('Error convertVideoIdsFromDB', error);
    }
}

export const saveSongOnDb = (song: any, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];

        if (dbgroup.group_songs) {
            song.id = dbgroup.group_songs.length;
            dbgroup.group_songs.push(song);
        } else {
            song.id = 0;
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
            group_songs: [...new Map(dbgroup.group_songs.map((groupSong: any) => [groupSong.videoDetails.videoId, groupSong])).values()]
        });
    })
    .then(cb);
};

export const removeSongFromDB = (song: any, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];

        // tslint:disable-next-line:max-line-length
        const filterDbgroupSongs = dbgroup.group_songs.filter((dbSong: any) => dbSong.videoDetails.videoId !== song.videoDetails.videoId);
        filterDbgroupSongs.forEach((_song: any, index: number) => Object.assign(_song, { id: index }));

        refGroup.update({
            group_songs: [...new Set(filterDbgroupSongs)]
        });
    })
    .then(cb);
};
