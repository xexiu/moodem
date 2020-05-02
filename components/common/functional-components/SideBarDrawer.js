/* eslint-disable max-len */
import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CommonDrawerWrapper } from './CommonDrawerWrapper';
import { Profile } from '../../User/functional-components/Profile';
import { UserContext } from '../../User/functional-components/UserContext';

const Drawer = createDrawerNavigator();

export const SideBarDrawer = (props) => {
    const { user, group } = useContext(UserContext);

    if (user) {
        return (
            <CommonDrawerWrapper user={user} group={group}>
                <Drawer.Screen name="Profile" component={Profile} options={Profile.navigationOptions} initialParams={{ group }} />
                {/*
              // TODO: ROADMAP Settings screen?
              <Drawer.Screen name="Settings" component={Settings} options={Settings.navigationOptions} initialParams={{ user: route.params.user, group: this.state.group }} /> */

                }
            </CommonDrawerWrapper>
        );
    }
    return (
        <CommonDrawerWrapper user={user} group={group} />
    );
};

