/* eslint-disable camelcase */
/* eslint-disable max-len */
import { isEmpty } from '../../common';
import { DEFAULT_GROUP_AVATAR } from '../../constants/groups';
import firebase from '../services/firebase';

const normalize = (invitedEmails, ownerUserId, groupId) => {
    const normalEmails = [];

    if (invitedEmails) {
        let cleanEmails = /\s/g.test(invitedEmails);

        if (cleanEmails) {
            cleanEmails = invitedEmails.replace(/\s/g, ',');
        }
        const emails = (cleanEmails || invitedEmails).split(',');
        emails.forEach((email, index) => {
            if (''.indexOf(email) >= 0) {
                emails[index - 1] = '';
            } else {
                normalEmails.push({
                    email: email.toLowerCase(),
                    group_id: groupId,
                    owner_user_id: ownerUserId,
                    isAdmin: false,
                    isOwner: false
                });
            }
        });
    }

    return normalEmails;
};

const checkOwnerEmail = (invitedUsers, user) => new Promise((resolve, reject) => {
    invitedUsers.forEach(invitedUser => {
        if (user.email === invitedUser.email) {
            return reject('You can not invite yourself!');
        }
        return resolve();
    });
    return resolve();
});

const markInvitedUsers = (invitedUsers, user, data, validate) => {
    if (invitedUsers && invitedUsers.length) {
        data.ref.update({
            invited_users: normalize(validate.invited_emails, user.uid, data.key),
            group_users_count: invitedUsers.length + 1
        });

        firebase.database().ref('Users').on('value', snapshot => {
            snapshot.forEach(s => {
                const userAttrs = snapshot.child(s.key).val();

                invitedUsers.forEach(invitedUser => {
                    if (userAttrs.email === invitedUser.email) {
                        firebase.database().ref(`Users/${s.key}/groups_invited/${data.key}`).set({
                            group_id: data.key,
                            owner_user_id: user.uid,
                            isAdmin: false,
                            isOwner: false
                        });
                    }
                });
            });
        });
    }

    return null;
};

export const getGroupName = (groupName, screenName) => (groupName === 'Moodem' ? `My ${screenName}` : `${groupName}`);

export const createInvitedGroup = (user, group) => {
    const refInvited = firebase.database().ref(`Groups/${user.uid}`);
    const refOwnergroup = firebase.database().ref(`Groups/${group.user_owner_id}`);
    const userGroupInvited = refInvited.child(group.group_id);

    refOwnergroup.on('value', snapshot => {
        if (snapshot.val()) {
            if (Object.keys(snapshot.val()).indexOf(group.group_id) >= 0) {
                const ownerGroupObj = snapshot.val()[group.group_id];
                if (ownerGroupObj.group_users_count.users.indexOf(user.uid) < 0) {
                    ownerGroupObj.group_users_count.users.push(user.uid);
                }

                Object.assign(ownerGroupObj, {
                    isOwner: false,
                    isAdmin: false
                });
                userGroupInvited.set(ownerGroupObj);
                refOwnergroup.child(group.group_id).update({
                    group_users_count: {
                        users: ownerGroupObj.group_users_count.users
                    }
                });
            }
        }
    });
};

export const createGroupHandler = (validate, user) => new Promise((resolve, reject) => {
    const invitedUsers = normalize(validate.invited_emails, user.uid);

    checkOwnerEmail(invitedUsers, user)
        .then(() => {
            firebase.database().ref(`Groups/${user.uid}`).push({
                group_name: validate.group_name,
                group_password: validate.group_password,
                isAdmin: true,
                isOwner: true,
                user_owner_id: user.uid,
                group_avatar: DEFAULT_GROUP_AVATAR,
                group_users_count: {
                    users: [user.uid]
                }
            })
                .then((data) => {
                    data.ref.update({ group_id: data.key });
                    markInvitedUsers(invitedUsers, user, data, validate);
                    return resolve(data);
                })
                .catch((error) => reject(error));
        })
        .catch(error => reject(error));
});

export const getOwnedGroupsFromDatabase = (ref) => new Promise((resolve) => {
    ref.once('value')
        .then(snapshot => {
            const groups = snapshot.val() || [];

            return resolve(Object.values(groups));
        });
});

export const getInvitedGroupsFromDatabase = (ref) => new Promise((resolve) => {
    ref.once('value')
        .then(snapshot => {
            if (snapshot.val()) {
                const data = Object.values(snapshot.val()) || [];
                const groups = [];

                for (let i = 0; i < data.length; i++) {
                    const groupAttr = data[i];
                    const groupRef = firebase.database().ref().child(`Groups/${groupAttr.owner_user_id}/${groupAttr.group_id}`);

                    groupRef.once('value')
                        .then(groupSnapshot => {
                            const group = groupSnapshot.val() || [];

                            if (!isEmpty(group)) {
                                group.isAdmin = false;
                                group.isOwner = false;
                                group.invited = true;
                                groups.push(group);

                                return i === (data.length - 1) && resolve(groups);
                            }
                            return resolve(groups);
                        });
                }
            } else {
                resolve([]);
            }
        });
});

export const getAllGroups = () => new Promise(resolve => {
    const ref = firebase.database().ref('Groups');

    ref.once('value')
        .then(snapshot => {
            if (snapshot.val()) {
                const data = Object.values(snapshot.val()) || [];
                const groups = [];

                data.forEach((group) => {
                    const groupObj = Object.values(group)[0];
                    groups.push(groupObj);
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
});

export const getGroups = (user) => {
    const allGroups = [];
    const refOwnedGroups = firebase.database().ref().child(`Groups/${user.uid}`);
    const refInvitedUsers = firebase.database().ref().child(`Users/${user.uid}/groups_invited`);

    return new Promise((resolve, reject) => {
        getOwnedGroupsFromDatabase(refOwnedGroups)
            .then(groupsOwned => {
                allGroups.push(...groupsOwned);
                getInvitedGroupsFromDatabase(refInvitedUsers)
                    .then(invitedToGroups => {
                        allGroups.push(...invitedToGroups);
                        return resolve(allGroups);
                    });
            })
            .catch(err => reject(err));
    });
};