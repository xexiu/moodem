import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { songType } from '../../../../src/types/songs';

export type State = {
    songs: (songType | songType)[];
    isLoading: boolean;
    songToTransform: songType,
    indexItem: number,
    index: number
};
export type actionType = {
    value: State,
    type: string
};

export type SongsProps = {
    children: React.ReactNode;
};

export const initialValue: State = {
    songs: [...new Set([])],
    indexItem: 0,
    index: 0,
    isLoading: true,
    songToTransform: null
};

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomLayoutLinear = {
    duration: 300,
    create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
    },
    update: {
        type: LayoutAnimation.Types.easeInEaseOut
    },
    delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
    }
};

const setAnimation = () => {
    LayoutAnimation.configureNext(CustomLayoutLinear);
};

export function removeSong(result: State, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { songToTransform } = value;
    const song = songs[indexItem];

    const indexInArray = songs.findIndex(_song => _song.id === songToTransform.id);
    if (indexInArray > -1) {
        songs.splice(indexInArray, 1);
    }

    setAnimation();

    const newIndexItem = songs.findIndex(_song => _song.id === song.id);

    Object.assign(result, {
        indexItem: song?.isPlaying ? newIndexItem !== -1 ? newIndexItem : 0 : 0
    });

    return { ...result, ...value };
}

export function addSong(result: State, action: actionType) {
    const { songs } = result;
    const { value } = action;
    const { songToTransform } = value;

    const indexInArray = songs.findIndex((song) => song.id === songToTransform.id);

    if (indexInArray === -1) {
        songs.push(songToTransform);
        setAnimation();
    }

    return { ...result, ...value };
}

export function updateSong(result: State, action: actionType) {
    const { value } = action;
    const { index } = value;
    const { indexItem, songs } = result;

    if (index !== undefined) {
        if (indexItem === index) {
            Object.assign(songs[index], {
                isPlaying: !songs[index].isPlaying
            });
        } else {
            if (songs[result.indexItem]) {
                Object.assign(songs[result.indexItem], {
                    isPlaying: false
                });
            }
            Object.assign(songs[index], {
                isPlaying: !songs[index].isPlaying
            });
        }
    }
    return { ...result, ...value };
}

export function resetSongs(result: State) {
    const { songs, indexItem } = result;

    if (songs.length) {
        Object.assign(songs[indexItem], {
            isPlaying: false
        });
    }

    Object.assign(result, {
        indexItem: 0
    });

    return { ...initialValue, ...result };
}

export function setSongs(result: State, action: actionType) {
    const { value } = action;

    Object.assign(result, {
        indexItem: 0
    });

    return { ...result, ...value };
}

export function setVotedSong(result: State, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { songToTransform } = value;
    const song = songs[indexItem];
    const indexInArray = songs.findIndex(_song => _song.id === songToTransform.id);

    if (songs[indexInArray].id === songToTransform.id) {
        Object.assign(songs[indexInArray], {
            voted_users: songToTransform.voted_users
        });
    }

    songs.sort((a: any, b: any) => {
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

    setAnimation();
    const newIndexItem = songs.findIndex(_song => _song.id === song.id);

    Object.assign(result, {
        indexItem: song.isPlaying ? newIndexItem : 0
    });

    return { ...result, ...value };
}

export function transformSongWithError(result: State, action: actionType) {
    const { songs } = result;
    const { value } = action;
    const { songToTransform } = value;

    if (songToTransform && Object.keys(songToTransform).length) {
        const indexInArray = songs.findIndex(_song => _song.id === songToTransform.id);

        songs.splice(indexInArray, 1, songToTransform);
    }

    return { ...result, ...value };
}
