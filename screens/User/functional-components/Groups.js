/* eslint-disable max-len, global-require */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { CreateGroup } from '../../../components/User/class-components/CreateGroup';
import { isEmpty } from '../../../src/js/Utils/common';
import { GroupEmpty } from './GroupEmpty';
import { PreLoader } from '../../../components/common/functional-components/PreLoader';
import { BurgerMenuIcon } from '../../../components/common/BurgerMenuIcon';
import { BgImage } from '../../../components/common/functional-components/BgImage';

function getGroupsFromDatabase(ref) {
    return new Promise(resolve => {
        ref.once('value')
            .then(snapshot => resolve(snapshot.val() || []));
    });
}

function getInvitedGroupsFromDatabase(ref) {
    return new Promise(resolve => {
        ref.once('value')
            .then(snapshot => {
                const data = snapshot.val();
                return resolve(data ? Object.values(data) : []);
            });
        // reference.on('value', snapshot => {
        //     const invitedToGroups = [];

        //     snapshot.forEach(s => {
        //         const data = snapshot.child(s.key).val();

        //         if (s.key === 'groups_invited') {
        //             const groups = Object.values(data);

        //             if (groups.length) {
        //                 for (let i = 0; i < groups.length; i++) {
        //                     const groupAttr = groups[i];
        //                     const dbGroupRef = firebase.database().ref().child(`Groups/${groupAttr.owner_user_id}/${groupAttr.group_id}`);

        //                     dbGroupRef.on('value', snapshotGroup => {
        //                         const group = {};
        //                         snapshotGroup.forEach(values => {
        //                             group[values.key] = snapshotGroup.child(values.key).val();
        //                         });
        //                         invitedToGroups.push(group);

        //                         if (i === (groups.length - 1)) {
        //                             invitedToGroups.unshift({
        //                                 group_category_name: 'Invited to Groups'
        //                             });
        //                             return resolve(invitedToGroups);
        //                         }
        //                     });
        //                 }
        //             } else {
        //                 return resolve(invitedToGroups);
        //             }
        //         }
        //     });
        //     return resolve(invitedToGroups);
        // });
    });
}

export class Groups extends Component {
    static navigationOptions = ({ route }) => ({
        headerMode: 'none',
        headerShown: false,
        title: getGroupName(route.params.groupName, 'Groups')
    });

    constructor(props) {
        super(props);

        this.refToast = React.createRef();
        this.refOwnedGroups = firebase.database().ref().child(`Groups/${props.route.params.user.uid}`);
        this.refUsers = firebase.database().ref().child(`Users/${props.route.params.user.uid}`);
        this.state = {
            removingGroupId: null,
            groups: [],
            loaded: false
        };
    }

    componentDidMount() {
        this.getGroups();
    }

    getGroups = () => {
        getGroupsFromDatabase(this.refOwnedGroups)
            .then(groupsOwned => {
                //console.log('Groups Owned', groupsOwned);
                if (groupsOwned.length) {
                    groupsOwned.unshift({
                        group_category_name: 'Owned Groups'
                    });
                }
                this.setState({
                    groups: [...this.state.groups, ...groupsOwned]
                });

                getInvitedGroupsFromDatabase(this.refUsers)
                    .then(invitedToGroups => {
                        //console.log('Invited Groups', invitedToGroups);
                        this.setState({
                            groups: [...this.state.groups, ...invitedToGroups],
                            loaded: true
                        });
                    });
            });
    }

    setGroupImage() {

    }

    setGroupName() {

    }

    getGroupTitle(item) {
        if (item.group_category_name) {
            return (
                <Text style={{ fontSize: 20 }}>{item.group_category_name}</Text>
            );
        }
        return (
            <View style={{ position: 'relative' }}>
                <View style={{ borderWidth: 1, borderColor: '#bbb', borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <BgImage source={{ uri: item.group_avatar }} bgImageStyle={{ height: 40, width: 40 }} />
                </View>
                <View style={{ position: 'absolute', marginLeft: 70, marginTop: 15 }}>
                    <Text style={{ fontSize: 15, padding: 0, marginLeft: -12, color: '#444' }}>{item.group_name}</Text>
                </View>
            </View>
        );
    }

    handleNewCreateGroup(data) {
        data.once('value')
            .then(snapshot => {
                const group = snapshot.val();
                if (!this.state.groups.length) {
                    this.setState({
                        groups: [{
                            group_category_name: 'Owned Groups'
                        }]
                    });
                }
                this.setState({
                    groups: [...this.state.groups, group]
                });
            });
    }

    removeGroup = (item, user) => {
        this.setState({ removingGroupId: item.group_id });
        const ref = firebase.database().ref().child(`Groups/${user.uid}/${item.group_id}`);

        ref.once('value', snapshot => {
            snapshot.ref.remove().then(() => {
                this.state.groups = this.state.groups.filter(group => group.group_id !== item.group_id);
                if (this.state.groups.length === 1) {
                    this.state.groups.shift();
                    this.setState({ groups: [], isRemoving: false });
                } else {
                    this.setState({ groups: this.state.groups, isRemoving: false });
                }
            })
                .catch(err => {
                    console.log('There was an error removing the group', err);
                });
        });
    }

    renderRemoveGroupIcon = (item, user, removingGroupId) => {
        if (item.user_owner_id === user.uid) {
            return (<Icon
                name={removingGroupId === item.group_id ? 'sync' : 'remove'}
                type={removingGroupId === item.group_id ? 'ant-desing' : 'font-awesome'}
                color='#777'
                underlayColor='transparent'
                onPress={() => this.removeGroup(item, user)}
            />);
        }
    }

    renderItem(item, navigation, handleGroupName, user, removingGroupId) {
        return (
            <ListItem
                containerStyle={{ backgroundColor: 'transparent', marginBottom: 0 }}
                disabled={!!item.group_category_name}
                bottomDivider
                Component={TouchableOpacity}
                title={this.getGroupTitle(item)}
                chevron={() => !item.group_category_name && this.renderRemoveGroupIcon(item, user, removingGroupId)}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                onPress={() => {
                    handleGroupName(item.group_name);
                    navigation.push('Drawer', {
                        screen: 'Moodem',
                        params: {
                            groupName: item.group_name
                        }
                    });
                }}
            />
        );
    }

    render() {
        const handleGroupName = this.props.route.params.handleGroupName;
        const user = this.props.route.params.user;
        const {
            groups,
            loaded,
            removingGroupId
        } = this.state;
        const {
            navigation
        } = this.props;

        //console.log('Rendered groups', groups, 'loaded', loaded, 'and func');

        if (!loaded) {
            return (<PreLoader />);
        }

        if (isEmpty(groups)) {
            return (
                <View style={{ marginTop: 35, padding: 10, position: 'relative' }}>
                    <BurgerMenuIcon action={() => navigation.openDrawer()} />
                    {user ?
                        <CreateGroup handleGroupName={handleGroupName} navigation={navigation} user={user} handleNewCreateGroup={this.handleNewCreateGroup.bind(this)} /> :
                        this.props.navigation.navigate('Guest')
                    }
                    <GroupEmpty />
                    <Toast
                        position='top'
                        ref={this.refToast}
                    />
                </View>);
        }

        return (
            <View style={{ marginTop: 35, padding: 10, position: 'relative' }}>
                <BurgerMenuIcon action={() => navigation.openDrawer()} />
                {this.props.route.params.user ?
                    <CreateGroup handleGroupName={handleGroupName} navigation={navigation} user={user} handleNewCreateGroup={this.handleNewCreateGroup.bind(this)} /> :
                    this.props.navigation.navigate('Guest')
                }

                <FlatList
                    windowSize={12}
                    keyboardShouldPersistTaps="always"
                    data={groups}
                    renderItem={({ item }) => this.renderItem(item, navigation, handleGroupName, user, removingGroupId)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

