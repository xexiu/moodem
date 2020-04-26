/* eslint-disable max-len, global-require */
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { P2PLanding } from '../../../components/User/P2PLanding';
import { ChatRoom } from '../../../screens/common/functional-components/ChatRoom';
import { Groups } from '../../../screens/User/functional-components/Groups';
import { SideBarTopHeader } from '../../../screens/User/functional-components/SideBarTopHeader';
import { SideBarFooter } from '../../../components/User/functional-components/SideBarFooter';

const Drawer = createDrawerNavigator();

function itemsDrawer(props, params) {
    return (
        <DrawerContentScrollView {...props} style={{ position: 'relative' }}>
            <SideBarTopHeader navigation={props.navigation} params={params} groupName={getGroupName(params.groupName)} signOut={params.signOut} goHome={params.goHome} />
            <DrawerItemList {...props} />
            <SideBarFooter navigation={props.navigation} />
        </DrawerContentScrollView>
    );
}

export const CommonDrawerWrapper = (props) => {
    const {
        user,
        groupName,
        signOut,
        goHome,
        handleGroupName
    } = props;

    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: '#dd0031',
                itemStyle: { marginVertical: -2 }
            }}
            initialRouteName={groupName} drawerType="slide" drawerContent={(_props) => itemsDrawer({ ..._props }, { user, groupName, signOut, goHome })}
        >
            <Drawer.Screen name={groupName} component={P2PLanding} options={P2PLanding.navigationOptions} initialParams={{ user, groupName }} />
            <Drawer.Screen name="Chat Room" component={ChatRoom} options={ChatRoom.navigationOptions} initialParams={{ user, groupName }} />
            <Drawer.Screen name="Groups" component={Groups} options={Groups.navigationOptions} initialParams={{ user, groupName, handleGroupName }} />
            {props.children}
        </Drawer.Navigator>
    );
};

