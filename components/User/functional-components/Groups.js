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

const {
    width
} = Dimensions.get('window');

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
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getGroups(user)
            .then((dbGroups) => setGroups(dbGroups))
            .catch(err => console.log('Seomthing happened', err));

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
    } else if (!groups.length) {
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

// export class Groups extends Component {
//     static navigationOptions = ({ route }) => ({
//         headerMode: 'none',
//         headerShown: false,
//         title: getGroupName(route.params.group.group_name, 'Groups')
//     });

//     constructor(props) {
//         super(props);

//         this.refToast = React.createRef();
//         this.refOwnedGroups = firebase.database().ref().child(`Groups/${props.route.params.user.uid}`);
//         this.refInvitedUsers = firebase.database().ref().child(`Users/${props.route.params.user.uid}/groups_invited`);
//         this.controller = new AbortController();
//         this.signal = this.controller.signal;
//         this.state = {
//             removingGroupId: null,
//             groups: [],
//             loaded: false
//         };
//     }

//     componentDidMount() {
//         this.getGroups();
//     }

//     componentWillUnmount() {
//         this.controller.abort();
//     }

//     getGroups = () => {
//         getOwnedGroupsFromDatabase(this.refOwnedGroups)
//             .then(groupsOwned => {
//                 //console.log('Groups Owned', groupsOwned);
//                 this.setState({
//                     groups: [...this.state.groups, ...groupsOwned]
//                 });

//                 getInvitedGroupsFromDatabase(this.refInvitedUsers)
//                     .then(invitedToGroups => {
//                         //console.log('Invited Groups', invitedToGroups);
//                         this.setState({
//                             groups: [...this.state.groups, ...invitedToGroups],
//                             loaded: true
//                         });
//                     });
//             });
//     }

//     setGroupImage() {

//     }

//     setGroupName() {

//     }

//     getGroupTitle(item) {
//         return (
//             <View style={{ position: 'relative' }}>
//                 <View style={{ borderWidth: 1, borderColor: '#bbb', borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
//                     <BgImage source={{ uri: item.group_avatar }} bgImageStyle={{ height: 40, width: 40 }} />
//                 </View>
//                 <View style={{ position: 'absolute', marginLeft: 70, marginTop: 15 }}>
//                     <Text style={{ fontSize: 15, padding: 0, marginLeft: -12, color: '#444', width: width - 140 }} ellipsizeMode="tail" numberOfLines={1}>{item.group_name}</Text>
//                 </View>
//             </View>
//         );
//     }

//     handleNewCreateGroup(data) {
//         data.once('value')
//             .then(snapshot => {
//                 const group = snapshot.val();
//                 this.setState({
//                     groups: [...this.state.groups, group]
//                 });
//             });
//     }

//     removeGroup = (item, user) => {
//         this.setState({ removingGroupId: item.group_id });
//         const ref = firebase.database().ref().child(`Groups/${user.uid}/${item.group_id}`);

//         ref.once('value', snapshot => {
//             snapshot.ref.remove().then(() => {
//                 this.state.groups = this.state.groups.filter(group => group.group_id !== item.group_id);
//                 this.setState({ groups: this.state.groups, isRemoving: false });
//             })
//                 .catch(err => {
//                     console.log('There was an error removing the group', err);
//                 });
//         });
//     }

//     renderRemoveGroupIcon = (item, user, removingGroupId) => {
//         if (item.user_owner_id === user.uid) {
//             return (<Icon
//                 name={removingGroupId === item.group_id ? 'sync' : 'remove'}
//                 type={removingGroupId === item.group_id ? 'ant-desing' : 'font-awesome'}
//                 color='#dd0031'
//                 underlayColor='transparent'
//                 onPress={() => Alert.alert(
//                     'Are you sure??',
//                     'Deleting the group will remove all users and files related!',
//                     [
//                         {
//                             text: 'Ask me later',
//                             onPress: () => console.log('Ask me later pressed')
//                         },
//                         {
//                             text: 'Cancel',
//                             onPress: () => console.log('Cancel Pressed'),
//                             style: 'cancel'
//                         },
//                         { text: 'OK', onPress: () => this.removeGroup(item, user) }
//                     ],
//                     { cancelable: false }
//                 )}
//             />);
//         }
//     }

//     renderItem(item, navigation, handleGroup, user, removingGroupId) {
//         return (
//             <ListItem
//                 containerStyle={{ backgroundColor: 'transparent', marginBottom: 0, position: 'relative' }}
//                 disabled={!!item.group_category_name}
//                 bottomDivider
//                 Component={TouchableOpacity}
//                 title={this.getGroupTitle(item)}
//                 subtitle={item.invited ? <Text style={{ paddingTop: 4, fontSize: 12, fontStyle: 'italic' }}>Invited</Text> : <Text style={{ paddingTop: 4, fontSize: 12, fontStyle: 'italic' }}>Owned</Text>}
//                 chevron={() => !item.group_category_name && this.renderRemoveGroupIcon(item, user, removingGroupId)}
//                 checkmark={() => <Text style={{ position: 'absolute', right: 0, bottom: 13, marginRight: 20, fontSize: 12, fontStyle: 'italic' }}>{item.group_users_count} user(s)</Text>}
//                 onPress={() => {
//                     //handleGroup(item);
//                     Object.assign(item, {
//                         ...item,
//                         group_name: 'Moodem'
//                     });
//                     navigation.push('Drawer', {
//                         screen: 'Moodem',
//                         params: {
//                             groupName: item.group_name
//                         }
//                     });
//                 }}
//             />
//         );
//     }

//     render() {
//         const { group } = useContext(UserContext);
//         const handleGroup = this.props.route.params.group;
//         const user = this.props.route.params.user;
//         const {
//             groups,
//             loaded,
//             removingGroupId
//         } = this.state;
//         const {
//             navigation
//         } = this.props;

//         console.log('Groups', this.props);

//         if (!user) {
//             navigation.navigate('Guest');
//         }

//         if (!loaded) {
//             return (<PreLoader
//                 size={50}
//                 containerStyle={{
//                     flex: 1,
//                     justifyContent: 'center',
//                     alignItems: 'center'
//                 }}
//             />);
//         }

//         if (isEmpty(groups)) {
//             return (
//                 <View style={{ marginTop: 35, padding: 10, position: 'relative' }}>
//                     <BurgerMenuIcon action={() => navigation.openDrawer()} />
//                     {user ?
//                         <CreateGroup user={user} handleNewCreateGroup={this.handleNewCreateGroup.bind(this)} /> :
//                         this.props.navigation.navigate('Guest')
//                     }
//                     <GroupEmpty />
//                     <Toast
//                         position='top'
//                         ref={this.refToast}
//                     />
//                 </View>);
//         }

//         return (
//             <View style={{ marginTop: 35, padding: 10, position: 'relative' }}>
//                 <BurgerMenuIcon action={() => navigation.openDrawer()} />
//                 {this.props.route.params.user ?
//                     <CreateGroup handleGroup={handleGroup} navigation={navigation} user={user} handleNewCreateGroup={this.handleNewCreateGroup.bind(this)} /> :
//                     this.props.navigation.navigate('Guest')
//                 }

//                 <FlatList
//                     windowSize={12}
//                     keyboardShouldPersistTaps="always"
//                     data={groups}
//                     renderItem={({ item }) => this.renderItem(item, navigation, handleGroup, user, removingGroupId)}
//                     keyExtractor={(item, index) => index.toString()}
//                 />
//             </View>
//         );
//     }
// }

