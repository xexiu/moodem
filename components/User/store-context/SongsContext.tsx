import React, { createContext, useReducer } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { songType } from '../../../src/js/typings/songs';

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
    isSongError: boolean;
    removedSong: songType,
    addedSong: songType,
    votedSong: songType,
    indexItem: number,
    index: number
};

const initialValue: Context = {
    songs: [],
    indexItem: 0,
    index: 0,
    isLoading: true,
    isSongError: false,
    removedSong: null,
    addedSong: null,
    votedSong: null
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

function removeSong(result: Context, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { removedSong } = value;
    const song = songs[indexItem];

    if (removedSong) {
        if (songs[removedSong.id].id === removedSong.id) {
            songs.splice(removedSong.id, 1);
            songs.forEach((_song, index) => Object.assign(_song, { id: index }));
            setAnimation();
        }

        if (song.isPlaying) {
            Object.assign(result, {
                indexItem: indexItem === songs.length ?
                    0 :
                    song.id
            });
        } else {
            Object.assign(result, {
                indexItem: 0
            });
        }
    }

    return { ...result, ...value };
}

function addSong(result: Context, action: actionType) {
    const { songs } = result;
    const { value } = action;
    const { addedSong } = value;

    if (addedSong) {
        songs.push(addedSong);
        songs.sort(compareValues('votes_count'));
        songs.forEach((song, index) => Object.assign(song, { id: index }));
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
    songs[indexItem].isPlaying = false;
    Object.assign(result, {
        indexItem: 0
    });

    return { ...initialValue, ...result };
}

function setSongs(result: Context, action: actionType) {
    return { ...result, ...action.value };
}

function setVotedSong(result: Context, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { votedSong } = value;
    const song = songs[indexItem];

    if (votedSong) {
        Object.assign(songs[votedSong.id], {
            votes_count: votedSong.votes_count,
            voted_users: votedSong.voted_users
        });

        songs.sort(compareValues('votes_count'));
        songs.forEach((_song, index) => Object.assign(_song, { id: index }));
        setAnimation();

        if (song.isPlaying) {
            Object.assign(result, {
                indexItem: song.id
            });
        }
    }

    return { ...result, ...value };
}

const MAP_ACTIONS = {
    update_song_reset: resetSongs,
    set_songs: setSongs,
    set_removed_song: removeSong,
    set_added_song: addSong,
    set_voted_song: setVotedSong,
    update_song_click_play_pause: updateSong
} as any;

function updateState(result: Context, action: actionType) {
    if (action.type === 'song_error') {
        return { ...result, ...action.value };
    }
    return MAP_ACTIONS[action.type](result, action) || result;
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