import React, { createContext, useReducer } from 'react';
import {
    actionType,
    AppProps,
    initialValue,
    setNewGroup,
    State,
    updateCommonState
} from './actions/app';

function deleteOwnedGroup(result: State, action: actionType) {
    const { groups } = result;
    const { value } = action;
    const { group } = value;

    const indexInArray = groups.findIndex((_group: any) => _group.group_id === group.group_id);
    groups.splice(indexInArray, 1);
    value.group = groups[0] as any;

    return { ...result, ...value };
}

const MAP_ACTIONS = {
    server_error: updateCommonState,
    user_groups: updateCommonState,
    guest: updateCommonState,
    set_current_group: updateCommonState,
    set_new_group: setNewGroup,
    delete_owned_group: deleteOwnedGroup
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
