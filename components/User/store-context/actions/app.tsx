import { groupType } from '../../../../src/types/group';

export type AppProps = {
    children: React.ReactNode;
};

export type actionType = {
    value: State,
    type: string
};

export type State = {
    user: null;
    groups: string[];
    group: groupType;
    isServerError: boolean;
    isLoading: boolean;
    socket: any
};

export const initialValue: State = {
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