import { DEFAULT_GROUP_AVATAR } from '../../constants/groups';
import firebase from '../services/firebase';

export const getGroupName = (groupName: string, screenName: string) => (groupName === 'Moodem' ? `My ${screenName}` : `${groupName}`);

export const createGroupHandler = (validate: any, user: any) => new Promise((resolve, reject) => {
    if (validate.group_name === 'Moodem') {
        console.log('Group Name Moodem is reserved', 'Error: ', validate.group_name);
        return;
    }
    firebase.database().ref(`Groups/${user.uid}`).push({
        group_songs: [],
        group_name: `${validate.group_name}-${user.uid}`,
        group_password: validate.group_password,
        group_user_owner_id: user.uid,
        group_avatar: DEFAULT_GROUP_AVATAR,
        group_users: [{
            user_uid: user.uid,
            group_owner: true,
            group_admin: true
        }]
    })
        .then((data: any) => {
            data.ref.update({ group_id: data.key });
            return resolve(data);
        })
        .catch((error: any) => reject(error));
});

export const getOwnedGroupsFromDatabase = (ref: any) => new Promise((resolve) => {
    return ref.on('value', (snapshot: any) => {
        const groups = snapshot.val() || [];
        resolve(Object.values(groups));
    });
});

export const getAllGroups = () => new Promise(resolve => {
    const ref = firebase.database().ref('Groups');

    ref.once('value')
        .then((snapshot: any) => {
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
});

export const getDefaultGroup = () => new Promise(resolve => {
    const refGroup = firebase.database().ref('Groups/Moodem');
    refGroup.on('value', (snapshot: any) => {
        const group = snapshot.val() || [];
        resolve(group);
    });
});

export const getGroups = (user: any) => {
    const allUserGroups = [] as any;
    const refOwnedGroups = firebase.database().ref().child(`Groups/${user.uid}`);

    return new Promise(async (resolve, reject): Promise<void> => {
        const defaultGroup = await getDefaultGroup();
        getOwnedGroupsFromDatabase(refOwnedGroups)
            .then(groupsOwned => {
                allUserGroups.push(defaultGroup, ...groupsOwned as any);
                return resolve(allUserGroups);
            })
            .catch(err => reject(err));
    });
};
