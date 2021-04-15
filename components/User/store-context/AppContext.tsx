import React, { createContext, useReducer } from 'react';

type Props = {
    children: React.ReactNode;
};

type State = {
    user: null;
    groups: string[];
    group: object;
};

const initialValue: State = {
    user: null,
    groups: [],
    group: {
        group_name: 'Moodem',
        group_id: 0
    }
};

const reducer = (state: any, action: any) => {
    if (action.type === 'reset') {
        return initialValue;
    }

    const result = { ...state };
    result[action.type] = action.value;
    return result;
};

const AppContext = createContext<State>(initialValue);

const AppContextProvider = ({ children }: Props): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialValue);

    return (
        <AppContext.Provider value={{ ...initialValue, ...state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
