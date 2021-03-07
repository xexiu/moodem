import React, { createContext, useReducer } from 'react';

type Props = {
    children: React.ReactNode;
};

type Context = {
    user: null;
    groups: string[];
    group: object;
};

const initialContext: Context = {
    user: null,
    groups: [],
    group: {
        group_name: 'Moodem',
        group_id: 0
    },
    searchedSongs: {
        userId: {
            bla: [],
            test: []
        }
    }
};

const reducer = (state: any, action: any) => {
    if (action.type === 'reset') {
        return initialContext;
    }

    const result = { ...state };
    result[action.type] = action.value;
    return result;
};

const AppContext = createContext<Context>(initialContext);

const AppContextProvider = ({ children }: Props): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialContext);

    return (
        <AppContext.Provider value={{ ...initialContext, ...state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
