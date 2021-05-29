import React, { createContext, useReducer } from 'react';
import { groupType } from '../../../src/js/typings/group';

type Props = {
    children: React.ReactNode;
};

type State = {
    user: null;
    groups: string[];
    group: groupType;
    isServerError: boolean;
    isLoading: boolean;
    socket: any
};

const initialValue: State = {
    user: null,
    groups: [],
    group: {
        group_name: 'Moodem',
        group_id: 0,
        group_songs: []
    },
    isServerError: false,
    isLoading: true,
    socket: {
        disconnected: false,
        connected: true,
        on: () => {},
        off: () => {},
        close: () => {},
        disconnect: () => {},
        emit: (str: string, param: any) => {}
    }
};

const reducer = (state: any, action: any) => {
    const result = { ...state };

    if (action.type === 'reset') {
        return initialValue;
    } else if (action.type === 'server_error') {
        return { ...result, ...action.value };
    } else if (action.type === 'user_groups') {
        return { ...result, ...action.value };
    } else if (action.type === 'guest') {
        return { ...result, ...action.value };
    }

    result[action.type] = action.value;
    return result;
};

const AppContext = createContext<State>(initialValue);

const AppContextProvider = ({ children }: Props): JSX.Element => {
    const [state, dispatchContextApp] = useReducer(reducer, initialValue);

    return (
        <AppContext.Provider value={{ ...initialValue, ...state, dispatchContextApp }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
