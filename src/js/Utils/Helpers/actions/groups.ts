import { getKeyNumber, hasObjWithProp, isEmpty } from '../../../Utils/common/checkers';
import { DEFAULT_GROUP_AVATAR } from '../../constants/groups';
import { database } from '../services/firebase';

const refAllGroups = database().ref('Groups');
const refGroupMoodem = database().ref('Groups/Moodem');

export function filterSearchedGroups(group: any, searchedText: string, user: any) {
    return group.group_name.indexOf(searchedText) >= 0 &&
        group.group_user_owner_id !== user.uid &&
        !hasObjWithProp(group, 'group_users', { user_uid: user.uid });
}

export function filterSearchedPublicGroups(group: any, searchedText: string, user: any) {
    return group.group_name.indexOf(searchedText) >= 0 &&
        !group.group_password &&
        group.group_user_owner_id !== user.uid &&
        !hasObjWithProp(group, 'group_users', { user_uid: user.uid });
}

export function filterSearchedPrivateGroups(group: any, searchedText: string, user: any) {
    return group.group_name.indexOf(searchedText) >= 0 &&
        !!group.group_password &&
        group.group_user_owner_id !== user.uid &&
        !hasObjWithProp(group, 'group_users', { user_uid: user.uid });
}

export async function leaveGroup(group: any, user: any) {
    try {
        const refJoinedGroup = database().ref(`Groups/${group.group_user_owner_id}/${group.group_id}`);
        const refInvitedGroups = database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`);
        const snapshotInvited = await refInvitedGroups.once('value');
        const snapshot = await refJoinedGroup.child('group_users').once('value');
        const groupUsers = snapshot.val();
        const invited = snapshotInvited.val();

        if (groupUsers) {
            const indexInArray = groupUsers.findIndex((dbGroupUser: any) => dbGroupUser.user_uid === user.uid);
            const userToDelete = groupUsers[indexInArray];

            if (userToDelete) {
            // delete user from groupUsers
                groupUsers.splice(indexInArray, 1);
                await refJoinedGroup.child('group_users').set(groupUsers);
                if (invited) {
                // delete joined goup from user
                    const key = getKeyNumber(invited, 0);
                    const joinedGroups = invited[key] as any;
                    if (joinedGroups && !isEmpty(joinedGroups.joined_groups)) {
                        // tslint:disable-next-line:max-line-length
                        const _indexInArray = joinedGroups.joined_groups.findIndex((joinedGroup: any) => group.group_id === joinedGroup.group_id);
                        const _group = joinedGroups.joined_groups[_indexInArray];
                        if (_group) {
                            joinedGroups.joined_groups.splice(_indexInArray, 1);
                            await refInvitedGroups.child(`/${key}`).update(joinedGroups);
                        }

                    }
                }
            }
        }
    } catch (error) {
        console.warn('leaveGroup Error', error);
    }
}

export async function updateUserGroup(group: any, params: any) {
    try {
        const refOwnedGroups = database().ref(`Groups/${group.group_user_owner_id}/${group.group_id}`);
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
        console.warn('deleteGroupForEver Error', error);
    }
}

export async function deleteGroupForEver(group: any) {

    // TODO: delete also users that have joined
    try {
        const refOwnedGroups = database().ref(`Groups/${group.group_user_owner_id}/${group.group_id}`);
        await refOwnedGroups.remove();
    } catch (error) {
        console.warn('deleteGroupForEver Error', error);
    }
}

export async function createGroupHandler (validate: any, user: any) {
    if (validate.name === 'Moodem') {
        return;
    }

    try {
        const newGroup = database().ref(`Groups/${user.uid}`).push({
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
        const refOwnedGroups = database().ref().child(`Groups/${user.uid}/${newGroup.key}`);
        const group = await refOwnedGroups.once('value');

        return group.val();
    } catch (error) {
        console.warn('createGroupHandler Error', error);
    }
}

export async function getJoinedGroups(user: any) {
    const invitedGroups = [] as any;

    try {
        const refInvitedGroups = database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`);
        const snapshot = await refInvitedGroups.once('value');

        if (snapshot.val()) {
            const groups = Object.values(snapshot.val())[0] as any;
            await Promise.all(groups.joined_groups.map(async (group: any) => {
                // tslint:disable-next-line:max-line-length
                const refInvitedGroup = database().ref(`Groups/${group.user_owned_id}/${group.group_id}`);
                const invitedGroup = await refInvitedGroup.once('value');
                if (invitedGroup.val()) {
                    invitedGroups.push(invitedGroup.val());
                }
            }));
        }

        return invitedGroups;
    } catch (error) {
        console.warn('getJoinedGroups Error', error);
    }
}

export async function getOwnedGroupsFromDatabase (user: any) {
    const groups = [] as any;
    try {
        const refOwnedGroups = database().ref(`Groups/${user.uid}`) as any;
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
        console.warn('getOwnedGroupsFromDatabase Error', error);
    }
}

export async function getAllGroups() {
    const allGroups = [] as any;

    try {
        const snapshots = await refAllGroups.once('value') as any;

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
        console.warn('getAllGroups Error', error);
    }
}

export async function getDefaultGroup () {
    try {
        const snapshot = await refGroupMoodem.once('value');
        return Object.values(snapshot.val() || []);
    } catch (error) {
        console.warn('getDefaultGroup Error', error);
    }
}

export async function getUserGroups(user: any) {
    try {
        const defaultGroup = await getDefaultGroup();
        const ownedGroups = await getOwnedGroupsFromDatabase(user);
        const joinedGroups = await getJoinedGroups(user);

        return [...defaultGroup, ...ownedGroups, ...joinedGroups as any];

    } catch (error) {
        console.warn('getUserGroups Error', error);
    }
}

export async function addUserToJoinedGroupDB(group: any, user: any) {
    const groupName = `${group.group_name === 'Moodem' ? 'Moodem' : group.group_user_owner_id}`;

    try {
        const refJoinedGroup = database().ref(`Groups/${groupName}/${group.group_id}`);
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
        refJoinedGroup.update(dbgroup);
    } catch (error) {
        console.warn('addUserToJoinedGroupDB Error', error);
    }
}

export async function saveJoinedUser(group: any, user: any) {
    const refUserGroups = database().ref(`Groups/${user.uid}`);

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
            database().ref(`Groups/${user.uid}/${user.uid}_Joined_Groups`).push({
                joined_groups: [{
                    user_owned_id: group.group_user_owner_id,
                    group_id: group.group_id
                }]
            });
        }
    } catch (error) {
        console.warn('saveJoinedUser Error', error);
    }
}
