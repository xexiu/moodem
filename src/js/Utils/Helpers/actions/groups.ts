import { getKeyNumber, hasObjWithProp } from '../../../Utils/common/checkers';
import { DEFAULT_GROUP_AVATAR } from '../../constants/groups';
import firebase from '../services/firebase';

const refAllGroups = firebase.database().ref('Groups');
const refGroupMoodem = firebase.database().ref('Groups/Moodem');

export async function updateUserGroup(group: any, params: any) {
    try {
        const refOwnedGroups = await firebase.database().ref(`Groups/${group.group_user_owner_id}/${group.group_id}`);
        const snapshot = await refOwnedGroups.once('value');
        const dbgroup = snapshot.val();

        Object.assign(dbgroup, {
            group_name: params.name ? params.name : dbgroup.group_name,
            group_description: params.description ? params.description : dbgroup.group_description,
            group_password: params.password ? params.password : dbgroup.group_password,
            group_avatar: params.avatar ? params.avatar : dbgroup.group_avatar
        });
        await refOwnedGroups.update(dbgroup);
        return dbgroup;
    } catch (error) {
        console.error('deleteGroupForEver Error', JSON.stringify(error));
    }
}

export async function deleteGroupForEver(group: any) {

    // TODO: delete also users that have joined
    try {
        const refOwnedGroups = await firebase.database().ref(`Groups/${group.group_user_owner_id}/${group.group_id}`);
        await refOwnedGroups.remove();
    } catch (error) {
        console.error('deleteGroupForEver Error', JSON.stringify(error));
    }
}

export async function createGroupHandler (validate: any, user: any) {
    if (validate.name === 'Moodem') {
        console.log('Group Name Moodem is reserved', 'Error: ', validate.group_name);
        return;
    }

    try {
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
    } catch (error) {
        console.error('createGroupHandler Error', JSON.stringify(error));
    }
}

export async function getJoinedGroups(user: any) {
    const invitedGroups = [] as any;

    try {
        const refInvitedGroups = await firebase.database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`);
        const snapshot = await refInvitedGroups.once('value');

        if (snapshot.val()) {
            const groups = Object.values(snapshot.val())[0] as any;
            await Promise.all(groups.joined_groups.map(async (group: any) => {
                // tslint:disable-next-line:max-line-length
                const refInvitedGroup = await firebase.database().ref(`Groups/${group.user_owned_id}/${group.group_id}`);
                const invitedGroup = await refInvitedGroup.once('value');
                if (invitedGroup.val()) {
                    invitedGroups.push(invitedGroup.val());
                }
            }));
        }

        return invitedGroups;
    } catch (error) {
        console.error('getJoinedGroups Error', JSON.stringify(error));
    }
}

export async function getOwnedGroupsFromDatabase (user: any) {
    const groups = [] as any;
    try {
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
    } catch (error) {
        console.error('getOwnedGroupsFromDatabase Error', JSON.stringify(error));
    }
}

export async function getAllGroups() {
    const allGroups = [] as any;

    try {
        const snapshots = await refAllGroups.once('value');

        if (snapshots.hasChildren()) {
            const childrens = snapshots.numChildren();
            snapshots.forEach((snapshot: any) => {
                for (let i = 0; i < childrens; i++) {
                    if (snapshot.val()) {
                        snapshot.forEach((group: any) => {
                            if (!/Joined_Groups/.test(group.key)) {
                                allGroups.push(group.val());
                            }
                        });
                        break;
                    }
                }
            });
        }

        return allGroups;
    } catch (error) {
        console.error('getAllGroups Error', JSON.stringify(error));
    }
}

export async function getDefaultGroup () {
    try {
        const snapshot = await refGroupMoodem.once('value');
        return Object.values(snapshot.val() || []);
    } catch (error) {
        console.error('getDefaultGroup Error', JSON.stringify(error));
    }
}

export async function getUserGroups(user: any) {
    try {
        const defaultGroup = await getDefaultGroup();
        const ownedGroups = await getOwnedGroupsFromDatabase(user);
        const joinedGroups = await getJoinedGroups(user);

        return [...defaultGroup, ...ownedGroups, ...joinedGroups as any];

    } catch (error) {
        console.error('getUserGroups Error', JSON.stringify(error));
    }
}

export async function addUserToJoinedGroupDB(group: any, user: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;

    try {
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
            } else if (!dbgroup.group_users) {
                dbgroup.group_users = [];
                dbgroup.group_users.push({
                    user_uid: user.uid,
                    group_owner: dbgroup.user_owner_id === user.uid,
                    group_admin: dbgroup.user_owner_id === user.uid
                });
            }
        }
        return refJoinedGroup.update(dbgroup);
    } catch (error) {
        console.error('addUserToJoinedGroupDB Error', JSON.stringify(error));
    }
}

export async function saveJoinedUser(group: any, user: any) {
    const refUserGroups = await firebase.database().ref(`Groups/${user.uid}`);

    try {
        const snapshot = await refUserGroups.child(`${user.uid}_Joined_Groups`).once('value');
        const groups = snapshot.val();

        if (groups) {
            const key = getKeyNumber(groups, 0);
            const invitedGroups = groups[key] as any;
            for await (const joinedGroup of invitedGroups.joined_groups) {
                if (joinedGroup) {
                    if (!hasObjWithProp(invitedGroups, 'joined_groups', { group_id: group.group_id })) {
                        invitedGroups.joined_groups.push({
                            user_owned_id: group.group_user_owner_id,
                            group_id: group.group_id
                        });
                    }
                }
            }
            await refUserGroups.child(`${user.uid}_Joined_Groups/${key}`).update(invitedGroups);
        } else {
            await firebase.database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`).push({
                joined_groups: [{
                    user_owned_id: group.group_user_owner_id,
                    group_id: group.group_id
                }]
            });
        }
    } catch (error) {
        console.error('saveJoinedUser Error', JSON.stringify(error));
    }
}
