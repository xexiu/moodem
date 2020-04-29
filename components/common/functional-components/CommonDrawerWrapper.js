/* eslint-disable max-len, global-require */
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { P2PLanding } from '../../../components/User/P2PLanding';
import { ChatRoom } from '../../../screens/common/functional-components/ChatRoom';
import { Groups } from '../../../screens/User/functional-components/Groups';
import { SideBarTopHeader } from '../../../screens/User/functional-components/SideBarTopHeader';
import { SideBarFooter } from '../../../components/User/functional-components/SideBarFooter';

const Drawer = createDrawerNavigator();

function itemsDrawer(props, params) {
    return (
        <DrawerContentScrollView {...props} style={{ position: 'relative' }}>
            <SideBarTopHeader navigation={props.navigation} params={params} group={params.group} signOut={params.signOut} goHome={params.goHome} />
            <DrawerItemList {...props} />
            <SideBarFooter navigation={props.navigation} />
        </DrawerContentScrollView>
    );
}

export const CommonDrawerWrapper = (props) => {
    const {
        user,
        group,
        signOut,
        goHome,
        handleGroup
    } = props;

    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: '#dd0031',
                itemStyle: { marginVertical: -2 }
            }}
            initialRouteName={group.group_name} drawerType="slide" drawerContent={(_props) => itemsDrawer({ ..._props }, { user, group, signOut, goHome })}
        >
            <Drawer.Screen name={group.group_name} component={P2PLanding} options={P2PLanding.navigationOptions} initialParams={{ user, group, handleGroup }} />
            <Drawer.Screen name="Chat Room" component={ChatRoom} options={ChatRoom.navigationOptions} initialParams={{ user, group }} />
            {group.group_name === 'Moodem' && <Drawer.Screen name="Groups" component={Groups} options={Groups.navigationOptions} initialParams={{ user, group, handleGroup }} />}
            {props.children}
        </Drawer.Navigator>
    );
};

