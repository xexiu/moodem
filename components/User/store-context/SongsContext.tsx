import React, { createContext, useReducer } from 'react';

type songType = {
    id?: number,
    voted_users?: any
};

type actionType = {
    value: Context,
    type: string
};

type Props = {
    children: React.ReactNode;
};

type Context = {
    songs: (songType | any)[];
    isLoading: boolean;
    isAddingSong: boolean,
    isRemovingSong: boolean,
    isVoting: boolean,
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
    isAddingSong: false,
    isRemovingSong: false,
    isVoting: false,
    removedSong: null,
    addedSong: null,
    votedSong: null
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

    if (removedSong) {
        if (songs[removedSong.id].id === removedSong.id) {
            songs.splice(removedSong.id, 1);
            songs.forEach((song, index) => Object.assign(song, { id: index }));
        }
        Object.assign(result, {
            indexItem: indexItem >= removedSong.id && songs.length ?
                indexItem - 1 :
                indexItem
        });
    }

    return { ...result, ...action.value };
}

function addSong(result: Context, action: actionType) {
    const { songs } = result;
    const { value } = action;
    const { addedSong } = value;

    if (addedSong) {
        songs.push(addedSong);
        songs.forEach((song, index) => Object.assign(song, { id: index }));
    }

    return { ...result, ...action.value };
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
    const { songs } = initialValue;
    songs[result.indexItem].isPlaying = false;
    return initialValue;
}

function setSongs(result: Context, action: actionType) {
    return { ...result, ...action.value };
}

function setVotedSong(result: Context, action: actionType) {
    const { songs, indexItem } = result;
    const { value } = action;
    const { votedSong } = value;

    if (songs[votedSong.id].id === votedSong.id) {
        Object.assign(songs[votedSong.id].voted_users, votedSong.voted_users);
        songs.forEach((song, index) => Object.assign(song, { id: index }));
    }

    Object.assign(result, {
        indexItem: indexItem >= votedSong.id && songs.length ?
            indexItem - 1 :
            indexItem
    });

    songs.sort(compareValues('votes_count'));

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
    return MAP_ACTIONS[action.type](result, action) || result;
}

const reducer = (state: any, action: any) => {
    const result = { ...state };

    return updateState(result, action);
};

const SongsContext = createContext<Context>(initialValue);

const SongsContextProvider = ({ children }: Props): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialValue);

    return (
        <SongsContext.Provider value={{ ...initialValue, ...state, dispatch }}>
            {children}
        </SongsContext.Provider>
    );
};

export { SongsContext, SongsContextProvider };
