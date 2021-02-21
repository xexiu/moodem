import React, { createContext, Dispatch, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

type Context = {
    user: null;
    group: object;
    setContext: Dispatch<Context>;
};

const initialContext: Context = {
    user: null,
    group: {
        group_name: 'Moodem'
    },
    setContext: (): void => {

    }
};

const controller = new AbortController();
const AppContext = createContext<Context>(initialContext);

const AppContextProvider = ({ children }: Props): JSX.Element => {
    const [contextState, setContext] = useState(initialContext);
    console.log('INITITAL STATE', contextState);

    return (
        <AppContext.Provider value={{ ...initialContext, ...contextState, setContext }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppContextProvider };
