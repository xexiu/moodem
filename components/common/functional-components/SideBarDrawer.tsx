/* eslint-disable max-len */
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import PropTypes from 'prop-types';
import React, { memo, useContext } from 'react';
import SideBarTopAvatar from '../../../components/common/functional-components/SideBarTopAvatar';
import { SideBarFooter } from '../../../components/User/functional-components/SideBarFooter';
import ChatRoom from '../../User/functional-components/ChatRoom';
import { Groups } from '../../User/functional-components/Groups';
import { Profile } from '../../User/functional-components/Profile';
import { AppContext } from '../../User/store-context/AppContext';
import WelcomeLanding from './WelcomeLanding';

const Drawer = createDrawerNavigator();

function itemsDrawer(props: any) {
    return (
        <DrawerContentScrollView {...props} style={{ position: 'relative' }}>
            <SideBarTopAvatar navigation={props.navigation} />
            <DrawerItemList {...props} />
            <SideBarFooter navigation={props.navigation} />
        </DrawerContentScrollView>
    );
}

const SideBarDrawer = (props: any) => {
    const { group }: any = useContext(AppContext);

    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: '#dd0031',
                itemStyle: { marginVertical: 0 }
            }}
            initialRouteName={group.group_name}
            drawerType='slide'
            drawerContent={(_props) => itemsDrawer({ ..._props })}
        >
            <Drawer.Screen name={group.group_name} component={WelcomeLanding} />
            <Drawer.Screen name='ChatRoom' component={ChatRoom} options={{ headerShown: false, title: 'Chat' }} />
            <Drawer.Screen name='Groups' component={Groups} options={{ headerShown: false, title: 'Grupos' }} />
            <Drawer.Screen name='Profile' component={Profile} options={{ headerShown: false, title: 'Mi Perfil' }} />

            {props.children}
        </Drawer.Navigator>
    );
};

SideBarDrawer.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object
};

export default memo(SideBarDrawer);
