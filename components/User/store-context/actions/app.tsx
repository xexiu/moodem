import { groupType } from '../../../../src/types/group';

export type userProps = {
    uid: string
};

export type AppProps = {
    children: React.ReactNode;
};

export type actionType = {
    value: State,
    type: string
};

export type State = {
    user: userProps;
    groups: string[];
    group: groupType;
    params: any,
    isServerError: boolean;
    isLoading: boolean;
    socket: any
};

export const initialValue: State = {
    user: null,
    groups: [],
    group: {
        group_name: 'Moodem',
        group_id: '0',
        group_songs: [],
        user_owner_id: '',
        group_users: []
    },
    params: null,
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

export function deleteOwnedGroup(result: State, action: actionType) {
    const { groups } = result;
    const { value } = action;
    const { group } = value;

    const indexInArray = groups.findIndex((_group: any) => _group.group_id === group.group_id);
    groups.splice(indexInArray, 1);
    value.group = groups[0] as any;

    return { ...result, ...value };
}

export function updateOwnedGroup(result: State, action: actionType) {
    const { groups } = result as any;
    const { value } = action;
    const { group } = value;

    const indexInArray = groups.findIndex((_group: any) => _group.group_id === group.group_id);
    Object.assign(groups[indexInArray], group);

    return { ...result, ...value };
}

export function updateCommonState(result: State, action: actionType) {
    return { ...result, ...action.value };
}

export function setNewGroup(result: State, action: actionType) {
    const { groups, user } = result;
    const { value } = action;
    const { group } = value;

    group.group_users.push({
        user_uid: user.uid,
        group_owner: group.user_owner_id === user.uid,
        group_admin: group.user_owner_id === user.uid
    });

    groups.push(group as any);

    return { ...result, ...value };
}
