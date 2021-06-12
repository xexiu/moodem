import React, { createContext, useReducer } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { songType } from '../../../src/types/songs';

type actionType = {
    value: Context,
    type: string
};

type Props = {
    children: React.ReactNode;
};

type Context = {
    songs: (songType | songType)[];
    isLoading: boolean;
    removedSong: songType,
    addedSong: songType,
    votedSong: songType,
    transformedSong: songType,
    indexItem: number,
    index: number
};

const initialValue: Context = {
    songs: [...new Set([])],
    indexItem: 0,
    index: 0,
    isLoading: true,
    removedSong: null,
    addedSong: null,
    votedSong: null,
    transformedSong: null
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

function removeSong(result: Context, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { removedSong } = value;
    const song = songs[indexItem];

    const indexInArray = songs.findIndex(_song => _song.id === removedSong.id);
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

function addSong(result: Context, action: actionType) {
    const { songs } = result;
    const { value } = action;
    const { addedSong } = value;

    const indexInArray = songs.findIndex((song) => song.id === addedSong.id);

    if (indexInArray === -1) {
        songs.push(addedSong);
        setAnimation();
    }

    return { ...result, ...value };
}

function updateSong(result: Context, action: actionType) {
    const { value } = action;
    const { index } = value;
    const { indexItem, songs } = result;

    if (index !== undefined) {
        if (indexItem === index) {
            songs[index].isPlaying = !songs[index].isPlaying;
        } else {
            if (songs[result.indexItem]) {
                songs[result.indexItem].isPlaying = false;
            }
            songs[index].isPlaying = !songs[index].isPlaying;
        }
    }
    return { ...result, ...value };
}

function resetSongs(result: Context) {
    const { songs, indexItem } = result;

    if (songs.length) {
        songs[indexItem].isPlaying = false;
    }

    Object.assign(result, {
        indexItem: 0
    });

    return { ...initialValue, ...result };
}

function setSongs(result: Context, action: actionType) {
    const { value } = action;

    Object.assign(result, {
        indexItem: 0
    });

    return { ...result, ...value };
}

function setVotedSong(result: Context, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { votedSong } = value;
    const song = songs[indexItem];
    const indexInArray = songs.findIndex(_song => _song.id === votedSong.id);

    if (songs[indexInArray].id === votedSong.id) {
        Object.assign(songs[indexInArray], {
            voted_users: votedSong.voted_users
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

function transformSongWithError(result: Context, action: actionType) {
    const { songs } = result;
    const { value } = action;
    const { transformedSong } = value;

    const indexInArray = songs.findIndex(_song => _song.id === transformedSong.id);

    Object.assign(songs[indexInArray], {
        url: transformedSong.url
    });

    return { ...result, ...value };
}

const MAP_ACTIONS = {
    update_song_reset: resetSongs,
    set_songs: setSongs,
    set_removed_song: removeSong,
    set_added_song: addSong,
    set_voted_song: setVotedSong,
    song_error: transformSongWithError,
    update_song_click_play_pause: updateSong
} as any;

function updateState(result: Context, action: actionType) {
    return MAP_ACTIONS[action.type](result, action) || { ...initialValue };
}

const reducer = (state: any, action: any) => {
    const result = { ...state };

    return updateState(result, action);
};

const SongsContext = createContext<Context>(initialValue);

const SongsContextProvider = ({ children }: Props): JSX.Element => {
    const [state, dispatchContextSongs] = useReducer(reducer, initialValue);

    return (
        <SongsContext.Provider value={{ ...initialValue, ...state, dispatchContextSongs }}>
            {children}
        </SongsContext.Provider>
    );
};

export { SongsContext, SongsContextProvider };
