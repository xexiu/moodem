import React, { createContext, useReducer } from 'react';
import {
    actionType,
    addSong,
    initialValue,
    removeSong,
    resetSongs,
    setSongs,
    setVotedSong,
    SongsProps,
    State,
    transformSongWithError,
    updateSong
} from './actions/songs';

const MAP_ACTIONS = {
    update_song_reset: resetSongs,
    set_songs: setSongs,
    set_removed_song: removeSong,
    set_added_song: addSong,
    set_voted_song: setVotedSong,
    song_error: transformSongWithError,
    update_song_click_play_pause: updateSong
} as any;

function updateState(result: State, action: actionType) {
    return MAP_ACTIONS[action.type](result, action) || { ...initialValue };
}

const reducer = (state: any, action: any) => {
    const result = { ...state };

    return updateState(result, action);
};

const SongsContext = createContext<State>(initialValue);

const SongsContextProvider = ({ children }: SongsProps): JSX.Element => {
    const [state, dispatchContextSongs] = useReducer(reducer, initialValue);

    return (
        <SongsContext.Provider value={{ ...initialValue, ...state, dispatchContextSongs }}>
            {children}
        </SongsContext.Provider>
    );
};

export { SongsContext, SongsContextProvider };
