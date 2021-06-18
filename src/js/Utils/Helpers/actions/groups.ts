import { hasObjWithProp } from '../../../Utils/common/checkers';
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

export const getJoinedGroups = async (user: any) => {
    const invitedGroups = [] as any;
    const refInvitedGroups = await firebase.database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`);
    const snapshot = await refInvitedGroups.once('value');

    if (snapshot.val()) {
        const groups = Object.values(snapshot.val())[0] as any;
        await Promise.all(groups.joined_groups.map(async (group: any) => {
            const refInvitedGroup = await firebase.database().ref(`Groups/${group.user_owned_id}/${group.group_id}`);
            const invitedGroup = await refInvitedGroup.once('value');
            if (invitedGroup.val()) {
                invitedGroups.push(invitedGroup.val());
            }
        }));
    }

    return invitedGroups;
};

export const getOwnedGroupsFromDatabase = async (user: any) => {
    const groups = [] as any;
    const refOwnedGroups = await firebase.database().ref(`Groups/${user.uid}`);
    const snapshot = await refOwnedGroups.once('value');

    if (snapshot.val()) {
        snapshot.forEach((group: any) => {
            if (!/Joined_Groups/.test(group.key)) {
                groups.push(group.val());
            }
        });
    }

    return groups;
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
        const joinedGroups = await getJoinedGroups(user);

        return [...defaultGroup, ...ownedGroups, ...joinedGroups as any];

    } catch (error) {
        console.error('getUserGroups Error', JSON.stringify(error));
    }
};

export async function addUserToJoinedGroupDB(group: any, user: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;
    const refJoinedGroup = await firebase.database().ref(`Groups/${groupName}/${group.group_id}`);
    const snapshot = await refJoinedGroup.once('value');
    const dbgroup = snapshot.val();

    if (dbgroup) {
        if (dbgroup.group_users && !hasObjWithProp(dbgroup, 'group_users', { user_uid: user.uid })) {
            dbgroup.group_users.push({
                user_uid: user.uid,
                group_owner: dbgroup.user_owner_id === user.uid,
                group_admin: dbgroup.user_owner_id === user.uid
            });
        } else {
            dbgroup.group_users = [];
            dbgroup.group_users.push({
                user_uid: user.uid,
                group_owner: dbgroup.user_owner_id === user.uid,
                group_admin: dbgroup.user_owner_id === user.uid
            });
        }
    }
    return refJoinedGroup.update(dbgroup);
}

export async function saveJoinedUser(group: any, user: any) {
    const refUserGroups = await firebase.database().ref(`Groups/${user.uid}`);
    const snapshot = await refUserGroups.child('Joined').once('value');
    const dbJoined = snapshot.val();

    if (dbJoined) {
        if (dbJoined.indexOf(group.group_id) === -1) {
            dbJoined.push({
                joined_groups: [{
                    user_owned_id: group.group_user_owner_id,
                    group_id: group.group_id
                }]
            });
        }
    } else {
        await firebase.database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`).push({
            joined_groups: [{
                user_owned_id: group.group_user_owner_id,
                group_id: group.group_id
            }]
        });
    }
    debugger;
}
