import React, { createContext, useReducer } from 'react';
import {
    actionType,
    AppProps,
    initialValue,
    setNewGroup,
    State,
    updateCommonState
} from './actions/app';

const MAP_ACTIONS = {
    server_error: updateCommonState,
    user_groups: updateCommonState,
    guest: updateCommonState,
    set_current_group: updateCommonState,
    set_new_group: setNewGroup
} as any;

function updateState(result: State, action: actionType) {
    if (MAP_ACTIONS[action.type]) {
        return MAP_ACTIONS[action.type](result, action);
    }
    return result;
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
