import { DEFAULT_GROUP_AVATAR } from '../../constants/groups';
import firebase from '../services/firebase';

const refAllGroups = firebase.database().ref('Groups');
const refGroupMoodem = firebase.database().ref('Groups/Moodem');

export const createGroupHandler = async (validate: any, user: any) => {
    if (validate.name === 'Moodem') {
        console.log('Group Name Moodem is reserved', 'Error: ', validate.group_name);
        return;
    }

    const newGroup = await firebase.database().ref(`Groups/${user.uid}`).push({
        group_songs: [],
        group_name: validate.name,
        group_password: validate.password || '',
        group_user_owner_id: user.uid,
        group_description: validate.description || '',
        group_avatar: DEFAULT_GROUP_AVATAR,
        group_users: [{
            user_uid: user.uid,
            group_owner: true,
            group_admin: true
        }]
    });
    await newGroup.ref.update({ group_id: newGroup.key });
    const refOwnedGroups = await firebase.database().ref().child(`Groups/${user.uid}/${newGroup.key}`);
    const group = await refOwnedGroups.once('value');

    return group.val();
};

export const getOwnedGroupsFromDatabase = async (user: any) => {
    const refOwnedGroups = await firebase.database().ref(`Groups/${user.uid}`);
    const snapshot = await refOwnedGroups.once('value');

    return Object.values(snapshot.val() || []);
};

export const getAllGroups = async () => {
    const allGroups = [] as any;
    const snapshots = await refAllGroups.once('value');

    if (snapshots.hasChildren()) {
        const childrens = snapshots.numChildren();
        snapshots.forEach((snapshot: any) => {
            for (let i = 0; i < childrens; i++) {
                if (snapshot.val()) {
                    const group = Object.values(snapshot.val())[0];
                    allGroups.push(group);
                    break;
                }
            }
        });
    }

    return allGroups;
};

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
