import { DEFAULT_GROUP_AVATAR } from '../../constants/groups';
import firebase from '../services/firebase';

const refAllGroups = firebase.database().ref('Groups');
const refGroupMoodem = firebase.database().ref('Groups/Moodem');

export const createGroupHandler = async (validate: any, user: any) => {
    if (validate.group_name === 'Moodem') {
        console.log('Group Name Moodem is reserved', 'Error: ', validate.group_name);
        return;
    }

    const newGroup = await firebase.database().ref(`Groups/${user.uid}`).push({
        group_songs: [],
        group_name: validate.group_name,
        group_password: validate.group_password,
        group_user_owner_id: user.uid,
        group_avatar: DEFAULT_GROUP_AVATAR,
        group_users: [{
            user_uid: user.uid,
            group_owner: true,
            group_admin: true
        }]
    });
    newGroup.ref.update({ group_id: newGroup.key });

    return newGroup;
};

export const getOwnedGroupsFromDatabase = async (user: any) => {
    const refOwnedGroups = firebase.database().ref().child(`Groups/${user.uid}`);
    const snapshot = await refOwnedGroups.once('value');

    return Object.values(snapshot.val() || []);
};

export const getAllGroups = () => new Promise(async resolve => {
    const snapshot = await refAllGroups.once('value');

    if (snapshot.val()) {
        const data = Object.values(snapshot.val()) || [];
        const groups = [] as any;

        data.forEach((group: any) => {
            if (group && group.group_name !== 'Moodem') {
                const groupObj = Object.values(group)[0];
                groups.push(groupObj);
            }
        });

        for (let i = 0; i < groups.length; i++) {
            if (i === (groups.length - 1)) {
                resolve(groups);
            }
        }
    } else {
        resolve([]);
    }
});

export const getDefaultGroup = async () => {
    const snapshot = await refGroupMoodem.once('value');
    return Object.values(snapshot.val() || []);
};

export const getUserGroups = async (user: any) => {
    try {
        const defaultGroup = await getDefaultGroup();
        const ownedGroups = await getOwnedGroupsFromDatabase(user);

        return [...defaultGroup, ...ownedGroups as any];

    } catch (error) {
        console.error('getUserGroups Error', JSON.stringify(error));
    }
};
