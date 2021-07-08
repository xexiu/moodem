import React, { createContext, useReducer } from 'react';
import {
    actionType,
    AppProps,
    deleteOwnedGroup,
    initialValue,
    setNewGroup,
    setUser,
    State,
    updateCommonState,
    updateOwnedGroup
} from './actions/app';

const MAP_ACTIONS = {
    server_error: updateCommonState,
    error_user: updateCommonState,
    user_groups: updateCommonState,
    guest: updateCommonState,
    set_current_group: updateCommonState,
    set_new_group: setNewGroup,
    delete_owned_group: deleteOwnedGroup,
    update_owned_group: updateOwnedGroup,
    set_user: setUser
} as any;

function updateState(result: State, action: actionType) {
    if (MAP_ACTIONS[action.type]) {
        return MAP_ACTIONS[action.type](result, action);
    } else if (action.type === 'reset') {
        return { ...initialValue };
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
