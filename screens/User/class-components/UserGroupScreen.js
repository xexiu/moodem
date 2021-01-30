import React, { Component, useContext } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { UserContext } from '../../../components/User/functional-components/UserContext';
import { BurgerMenuIcon } from '../../../components/common/BurgerMenuIcon';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';

export class UserGroupScreen extends Component {
    static navigationOptions = ({ route }) => ({
        unmountOnBlur: true,
        title: getGroupName(route.params.group.group_name, '')
    });

    constructor(props) {
        super(props);
    }

    render() {
        const {
            user,
            navigation
        } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <View style={{ marginTop: 30, padding: 10 }}>
                    <Text>HeYYY</Text>
                    <BurgerMenuIcon
                        action={() => {
                            navigation.openDrawer();
                        }}
                    />

                </View>
            </View>
        );
    }
}
