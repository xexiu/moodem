/* eslint-disable camelcase */
/* eslint-disable max-len */
import firebase from '../services/firebase';

// editGroupHandler

function normalize(invitedEmails, ownerUserId, groupId) {
    const normalEmails = [];

    if (invitedEmails) {
        const emails = invitedEmails.split(',');
        emails.forEach(email => normalEmails.push({
            email: email.toLowerCase(),
            group_id: groupId,
            owner_user_id: ownerUserId
        }));
    }

    return normalEmails;
}

function checkOwnerEmail(invitedUsers, user) {
    return new Promise((resolve, reject) => {
        [...invitedUsers].forEach(invitedUser => {
            if (user.email === invitedUser.email) {
                return reject('You can not invite yourself!');
            }
            return resolve();
        });
        return resolve();
    });
}

function markInvitedUsers(invitedUsers, user, data, validate) {
    if (invitedUsers) {
        data.ref.update({
            invited_users: normalize(validate.invited_emails, user.uid, data.key),
            group_id: data.key
        });

        firebase.database().ref('Users').on('value', snapshot => {
            snapshot.forEach(s => {
                const userAttrs = snapshot.child(s.key).val();

                [...invitedUsers].forEach(invitedUser => {
                    if (userAttrs.email === invitedUser.email) {
                        firebase.database().ref(`Users/${s.key}/groups_invited/${data.key}`).set({
                            group_id: data.key,
                            owner_user_id: user.uid
                        });
                    }
                });
            });
        });
    }

    return null;
}

export const getGroupName = (groupName, screenName) => (groupName === 'Moodem' ? `My ${screenName}` : `${groupName} ${screenName}`);

export const createGroupHandler = (validate, user) => new Promise((resolve, reject) => {
    const invitedUsers = normalize(validate.invited_emails, user.uid);

    checkOwnerEmail(invitedUsers, user)
        .then(() => {
            firebase.database().ref(`Groups/${user.uid}`).push({
                group_name: validate.group_name,
                group_password: validate.group_password,
                isAdmin: true,
                isOwner: true,
                user_owner_id: user.uid
            })
                .then((data) => {
                    markInvitedUsers(invitedUsers, user, data, validate);
                    return resolve(data);
                })
                .catch((error) => reject(error));
        })
        .catch(error => reject(error));
});
