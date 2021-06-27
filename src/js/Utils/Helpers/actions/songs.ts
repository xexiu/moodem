// @ts-ignore
import ytdl from 'react-native-ytdl';
import { hasObjWithProp, isEmpty } from '../../../Utils/common/checkers';
import firebase from '../services/firebase';

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

export async function saveSongOnDb(song: any, user: any, group: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${groupName}/${group.group_id}`);

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
        const refGroup = await firebase.database().ref(`${'Groups/'}${groupName}/${group.group_id}`);
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
}

export async function removeSongFromDB(song: any, group: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;
    const refGroup = firebase.database().ref(`${'Groups/'}${groupName}/${group.group_id}`);

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

    firebase.storage().ref().child('songs').put(mergedArray, metadata).then((snapshot: any) => {
        console.log('Uploaded a blob or file!');
    });
}
