/* eslint-disable max-len, global-require */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import firebase from '../../../src/js/Utils/Helpers/services/firebase';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { CreateGroup } from '../../../components/User/class-components/CreateGroup';
import { isEmpty } from '../../../src/js/Utils/common';
import { GroupEmpty } from './GroupEmpty';
import { PreLoader } from '../../../components/common/functional-components/PreLoader';
import { BurgerMenuIcon } from '../../../components/common/BurgerMenuIcon';

function getGroupsFromDatabase(reference) {
    return new Promise(resolve => {
        reference.on('value', snapshot => {
            const groupsOwned = [
                {
                    group_category_name: 'Owned Groups'
                }
            ];

            snapshot.forEach(s => {
                const data = snapshot.child(s.key).val();

                groupsOwned.push(data);
            });

            resolve(groupsOwned);
        });
    });
}

function getInvitedGroupsFromDatabase(reference) {
    return new Promise(resolve => {
        reference.on('value', snapshot => {
            const invitedToGroups = [];

            snapshot.forEach(s => {
                const data = snapshot.child(s.key).val();

                if (s.key === 'groups_invited') {
                    const groups = Object.values(data);

                    if (groups.length) {
                        for (let i = 0; i < groups.length; i++) {
                            const groupAttr = groups[i];
                            const dbGroupRef = firebase.database().ref().child(`Groups/${groupAttr.owner_user_id}/${groupAttr.group_id}`);

                            dbGroupRef.on('value', snapshotGroup => {
                                const group = {};
                                snapshotGroup.forEach(values => {
                                    group[values.key] = snapshotGroup.child(values.key).val();
                                });
                                invitedToGroups.push(group);

                                if (i === (groups.length - 1)) {
                                    invitedToGroups.unshift({
                                        group_category_name: 'Invited to Groups'
                                    });
                                    resolve(invitedToGroups);
                                }
                            });
                        }
                    } else {
                        resolve(invitedToGroups);
                    }
                }
            });
        });
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
            groups: [],
            loaded: false
        };
    }

    componentDidMount() {
        getGroupsFromDatabase(this.refOwnedGroups)
            .then(groupsOwned => {
                this.setState({
                    groups: [...this.state.groups, ...groupsOwned]
                });

                getInvitedGroupsFromDatabase(this.refUsers)
                    .then(invitedToGroups => {
                        console.log('Inviiiited', invitedToGroups);
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

    renderItem(item, navigation, handleGroupName) {
        return (
            <ListItem
                containerStyle={{ backgroundColor: 'transparent', marginBottom: 0 }}
                disabled={!!item.group_category_name}
                bottomDivider
                Component={TouchableOpacity}
                title={item.group_name || <Text style={{ fontSize: 20 }}>{item.group_category_name}</Text>}
                titleStyle={{ padding: 0, marginLeft: -12 }}
                subtitle={item.group_name && <Text>Subitle</Text>}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                onPress={() => {
                    if (item.group_name) {
                        console.log('Pressed group');
                        handleGroupName(item.group_name);
                        navigation.push('Drawer', {
                            screen: 'Moodem',
                            params: {
                                groupName: item.group_name
                            }
                        });
                    } else {
                        navigation.push('Drawer', {
                            screen: 'Profile'
                        });
                    }
                }}
            />
        );
    }

    render() {
        const handleGroupName = this.props.route.params.handleGroupName;
        const user = this.props.route.params.user;
        const {
            groups,
            loaded
        } = this.state;
        const {
            navigation
        } = this.props;

        if (!loaded) {
            return (<PreLoader />);
        }

        if (isEmpty(groups)) {
            return (
                <View style={{ marginTop: 35, padding: 10, position: 'relative' }}>
                    <BurgerMenuIcon action={() => navigation.openDrawer()} />
                    {this.props.route.params.user ?
                        <CreateGroup handleGroupName={handleGroupName} navigation={navigation} user={user} /> :
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
                    <CreateGroup handleGroupName={handleGroupName} navigation={navigation} user={user} /> :
                    this.props.navigation.navigate('Guest')
                }

                <FlatList
                    windowSize={12}
                    keyboardShouldPersistTaps="always"
                    data={groups}
                    renderItem={({ item }) => this.renderItem(item, navigation, handleGroupName)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

