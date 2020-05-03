/* eslint-disable max-len, global-require */
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import AbortController from 'abort-controller';
import Toast from 'react-native-easy-toast';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';
import { getGroupName, getGroups } from '../../../src/js/Utils/Helpers/actions/groups';
import { isEmpty } from '../../../src/js/Utils/common';
import { GroupEmpty } from '../../../screens/User/functional-components/GroupEmpty';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';
import { BgImage } from '../../common/functional-components/BgImage';
import { UserContext } from './UserContext';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { CustomButton } from '../../common/functional-components/CustomButton';
import { NewGroup } from './NewGroup';

const renderItem = (group) => (
    <CommonFlatListItem
        bottomDivider
        title={group.group_name}
        subtitle={group.group_id}
    />
);

const Groups = (props) => {
    const controller = new AbortController();
    const { user, group } = useContext(UserContext);
    const { navigation } = props;
    const [groupId, setGroupId] = useState(null);
    const [showModal, setModal] = useState(false);
    const [{ groups = [], loaded = false }, setGroups] = useState({});

    useEffect(() => {
        getGroups(user)
            .then((dbGroups) => setGroups({
                groups: dbGroups,
                loaded: true
            }))
            .catch(err => console.log('Something happened', err));

        return () => {
            controller.abort();
        };
    }, [groups.length]);

    const toggleModal = (_showModal) => {
        setModal(_showModal);
    };

    const handleNewGroup = (newGroup) => {
        setGroups({
            groups: [...groups, newGroup],
            loaded: true
        });
    };

    if (!user) {
        navigation.navigate('Guest');
    } else if (!loaded) {
        return (<PreLoader
            size={50}
            containerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />);
    }

    return (
        <View style={{ marginTop: 35, padding: 10, position: 'relative', flex: 1, backgroundColor: 'transparent' }}>
            <BurgerMenuIcon action={() => navigation.openDrawer()} />
            <NewGroup showModal={showModal} toggleModal={toggleModal} user={user} handleNewGroup={handleNewGroup} />
            <CommonFlatList
                emptyListComponent={GroupEmpty}
                headerComponent={<View style={{ alignSelf: 'center', marginBottom: 10 }}><CustomButton btnTitle="Create Group" action={() => toggleModal(true)} /></View>}
                data={groups}
                action={({ item }) => renderItem(item)}
            />
        </View>
    );
};

Groups.navigationOptions = ({ route }) => ({
    title: getGroupName(route.params.group.group_name, 'Groups')
});

export {
    Groups
};
