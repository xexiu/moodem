// @ts-ignore
import ytdl from 'react-native-ytdl';
import { checkIfValidPromise, hasObjWithProp, isEmpty } from '../../../Utils/common/checkers';
import { loadFromLocalStorage, saveOnLocalStorage } from '../../../Utils/common/storageConfig';
import { OPTIONS } from '../../constants/extractor';
import { database, storage } from '../services/firebase';

export function setExtraAttrs(audios: any, uid: string, isSearching = false) {
    const audiosArr = [] as any;

    audios.forEach((track: any) => {
        Object.assign(track, {
            id: track.id,
            isSearching,
            isPlaying: false,
            isMediaOnList: false,
            boosts_count: 0,
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

function cleanTitle(title: string) {
    let sanitizeTitle = '';

    if (title) {
        sanitizeTitle = title
            .replace('(Official Music Video)', '')
            .replace('(Official Video)', '');
        return sanitizeTitle;
    }
    return sanitizeTitle;
}

function deleteObjAttrsExcept(object: any, exceptAttr: any) {
    // eslint-disable-next-line no-param-reassign
    Object.keys(object).forEach((attr) => attr !== exceptAttr && delete object[attr]);
}

function assignAttrs(object: any, attrs: any) {
    const song = Object.assign(object, {
        id: attrs.videoId || 'No Song ID',
        title: cleanTitle(attrs.title) || 'No Song title',
        author: {
            name: attrs.author.name || 'Anonymous Author',
            user: attrs.author.user || 'No Author User',
            id: attrs.author.id || 'No Author ID'
        },
        averageRating: attrs.averageRating || 0,
        category: attrs.category || 'No Category',
        description: attrs.description || 'No Description',
        keywords: attrs.keywords || [],
        likes: attrs.likes || 0,
        viewCount: attrs.viewCount || '0',
        duration: attrs.lengthSeconds || '0',
        thumbnail: attrs.thumbnails ? attrs.thumbnails[0].url : 'No image'
    });
    return song;
}

export async function getSong(videoId: string) {
    try {
        // await getStreamBuffers(videoId);
        const audioYT = await ytdl.getInfo(videoId, OPTIONS); // await getSongInfo(videoId);
        // eslint-disable-next-line max-len
        // await getSongInfo(videoId);
        // eslint-disable-next-line max-len
        // tslint:disable-next-line:max-line-length
        // const formats = audioYT.formats.filter((format) => format.acodec !== 'none' && format.vcodes !== 'none' && format.container === 'm4a_dash');
        const formats = audioYT.formats.filter((format: any) => format.hasAudio && format.hasVideo && format.container === 'mp4' && !format.isLive);

        if (formats && formats.length) {
            const audio = formats[0];
            deleteObjAttrsExcept(audio, 'url');
            assignAttrs(audio, audioYT.videoDetails);
            return { ...audio };
        }
        return {};
    } catch (error) {
        console.error('Error converting getSong', error);
    }

    return {};
}

const allSettled = (promises: any) => {
    return Promise.all(promises.map((promise: any) => promise
        .then((value: any) => ({ state: 'fulfilled', value }))
        .catch((reason: any) => ({ state: 'rejected', reason }))
    ));
};

async function getSongsOrCache(videoIds: any) {
    try {
        return await allSettled(videoIds.map(async (videoId: string) => {
            const audioCached = await loadFromLocalStorage(`youtubeSongs-${videoId}`);
            if (audioCached) {
                return audioCached;
            }
            const audio = await getSong(videoId);
            await saveOnLocalStorage(`youtubeSongs-${videoId}`, audio);
            return audio;
        }));
    } catch (error) {
        console.error('Error getSongsOrCache', error);
    }
    return {};
}

export async function getAllSongs(videoIds: any) {
    const songsCoverted = [] as any;
    try {
        const songs = await getSongsOrCache(videoIds) as any;

        if (songs && Object.keys(songs).length) {
            songs.filter((song: any) => checkIfValidPromise(song, songsCoverted), songsCoverted);
        }

        return songsCoverted;
    } catch (error) {
        console.error('Error getAllSongs', error);
    }
    return songsCoverted;
}

export async function saveSongOnDb(song: any, user: any, group: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;
    const refGroup = database().ref(`${'Groups/'}${groupName}/${group.group_id}`);

    try {
        const dbgroup = await refGroup.once('value');
        const _group = await dbgroup.val();

        if (_group.group_songs && !hasObjWithProp(_group, 'group_songs', { id: song.id })) {
            _group.group_songs.push(song);
        } else {
            _group.group_songs = [];
            _group.group_songs.push(song);
        }

        await refGroup.update(_group);
    } catch (error) {
        console.error('saveSongOnDb Error', error);
    }
}

export async function updateSongExpiredOnDB(song: any, group: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;

    try {
        const refGroup = database().ref(`${'Groups/'}${groupName}/${group.group_id}`);
        const snapshot = await refGroup.once('value');
        const dbgroup = await snapshot.val();

        if (dbgroup) {
            if (dbgroup.group_songs) {
                const indexInArray = dbgroup.group_songs.findIndex((dbSong: any) => dbSong.id === song.id);
                dbgroup.group_songs.splice(indexInArray, 1, song);
            } else {
                dbgroup.group_songs = [];
            }

            await refGroup.update(dbgroup);
        }
    } catch (error) {
        console.error('updateSongEpireOnDB Error', error);
    }

}

export async function saveVotesForSongOnDb(song: any, user: any, group: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;
    const refGroup = database().ref(`${'Groups/'}${groupName}/${group.group_id}`);
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
}

export async function removeSongFromDB(song: any, group: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;
    const refGroup = database().ref(`${'Groups/'}${groupName}/${group.group_id}`);

    try {
        const dbgroup = await refGroup.once('value');
        const _group = await dbgroup.val();
        const dbGroupSongs = _group.group_songs;

        if (!isEmpty(dbGroupSongs)) {
            const indexInArray = dbGroupSongs.findIndex((dbSong: any) => dbSong.id === song.id);
            dbGroupSongs.splice(indexInArray, 1);
        }

        await refGroup.child('group_songs').set(dbGroupSongs);
    } catch (error) {
        console.error('removeSongFromDB Error', error);
    }
}

export async function uploadSongBytes(_songs: any) {
    const metadata = { contentType: 'video/mp4' };
    const chunks = [] as any;

    _songs[0].chunks.forEach((chunk: any) => {
        const cloneChunk = new Uint8Array(chunk);
        chunks.push(cloneChunk);
    });

    let length = 0;
    chunks.forEach((item: any) => {
        length += item.length;
    });

    const mergedArray = new Uint8Array(length);
    let offset = 0;
    chunks.forEach((item: any) => {
        mergedArray.set(item, offset);
        offset += item.length;
    });

    storage().ref().child('songs').put(mergedArray, metadata).then((snapshot: any) => {
        console.log('Uploaded a blob or file!');
    });
}
