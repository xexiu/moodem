import React, { createContext, useReducer } from 'react';
import {
    actionType,
    AppProps,
    initialValue,
    State
} from './actions/app';

function updateCommonState(result: State, action: actionType) {
    return { ...result, ...action.value };
}

const MAP_ACTIONS = {
    server_error: updateCommonState,
    user_groups: updateCommonState,
    guest: updateCommonState
} as any;

function updateState(result: State, action: actionType) {
    return MAP_ACTIONS[action.type](result, action) || { ...initialValue };
}

const reducer = (state: any, action: any) => {
    const result = { ...state };

    return updateState(result, action);
};

const AppContext = createContext<State>(initialValue);

const AppContextProvider = ({ children }: AppProps): JSX.Element => {
    const [state, dispatchContextApp] = useReducer(reducer, initialValue);

    return (
        <AppContext.Provider value={{ ...initialValue, ...state, dispatchContextApp }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
