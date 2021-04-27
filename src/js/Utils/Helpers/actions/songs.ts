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

export function cleanVideoImageParams(info: any) {
    if (info && info.videoDetails && info.videoDetails.thumbnails
        && info.videoDetails.thumbnails.length) {
        if (info.videoDetails.thumbnails[0].url.indexOf('hqdefault.jpg') >= 0) {
            info.videoDetails.thumbnails[0].url = info.videoDetails.thumbnails[0].url.replace(/(\?.*)/g, '');
            return info.videoDetails.thumbnails[0].url;
        }
    }
    return info.videoDetails.thumbnails[0].url;
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

export function setExtraAttrs(audios: any, uid: string) {
    const audiosArr = [] as any;

    audios.forEach((track: any, index: number) => {
        Object.assign(track, {
            id: index,
            isPlaying: false,
            isMediaOnList: true,
            boosts_count: 0,
            votes_count: 0,
            voted_users: [],
            boosted_users: [],
            user: {
                uid
            }
        });
        audiosArr.push(track);
    });

    return audiosArr;
}

export async function convertVideoIdYtdl(videoId: string) {
    const info = await ytdl.getInfo(videoId);
    const audio = info.formats.filter((format: any) => format.hasAudio && format.hasVideo);

    cleanVideoImageParams(info);
    cleanVideoTitle(info);

    if (audio && audio.length) {
        return { ...info, ...audio[0] };
    }

    return {};
}

export async function convertVideoIdsFromDB(videoIds: string[] = []) {
    try {
        const audios = await Promise.all(videoIds.map(async (videoId: string) => convertVideoIdYtdl(videoId)));
        return audios;
    } catch (error) {
        // send error to sentry or other server
        console.log('Error convertVideoIdsFromDB', error);
    }
}

export const saveVideoIdOnDb = (videoId: string, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];

        if (dbgroup.group_videoIds) {
            dbgroup.group_videoIds.push(videoId);
        } else {
            dbgroup.group_videoIds = [];
            dbgroup.group_videoIds.push(videoId);
        }

        refGroup.update({
            group_videoIds: [...new Set(dbgroup.group_videoIds)]
        })
        .then(() => cb && cb());
    });
};

export const removeVideoIdFromDB = (videoId: string, user: any, groupName: string, cb: Function) => {
    const group = `${groupName === 'Moodem' ? 'Moodem' : user.uid}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${group}`);

    return refGroup.once('value', (snapshot: any) => {
        const dbgroup = snapshot.val() || [];
        const index = dbgroup.group_videoIds?.indexOf(videoId);

        if (index > -1) {
            dbgroup.group_videoIds.splice(index, 1);
        }

        refGroup.update({
            group_videoIds: [...new Set(dbgroup.group_videoIds)]
        })
        .then(() => cb && cb());
    });
};
