/* eslint-disable max-len */
import React, { useContext, memo } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { P2PLanding } from '../../../components/User/P2PLanding';
import { ChatRoom } from '../../User/class-components/ChatRoom';
import { Groups } from '../../User/functional-components/Groups';
import { Profile } from '../../User/functional-components/Profile';
import { SideBarTopHeader } from '../../../screens/User/functional-components/SideBarTopHeader';
import { SideBarFooter } from '../../../components/User/functional-components/SideBarFooter';
import { UserContext } from '../../User/functional-components/UserContext';
import { Login } from '../../../components/Guest/class-components/Login';
import { Register } from '../../../components/Guest/functional-components/Register';

const Drawer = createDrawerNavigator();

function itemsDrawer(props, params) {
    if (params.user) {
        return (
            <DrawerContentScrollView {...props} style={{ position: 'relative' }}>
                <SideBarTopHeader navigation={props.navigation} params={params} group={params.group} />
                <DrawerItemList {...props} />
                <SideBarFooter navigation={props.navigation} />
            </DrawerContentScrollView>
        );
    }
    return (
        <DrawerContentScrollView {...props} style={{ position: 'relative' }}>
            <SideBarTopHeader navigation={props.navigation} params={params} group={params.group} />
            <DrawerItemList {...props} />
            <Login btnTitle="Iniciar sesión" navigation={props.navigation} />
            <Register btnTitle="Registrarse " btnStyle={{ backgroundColor: '#00b7e0' }} navigation={props.navigation} />
            <SideBarFooter navigation={props.navigation} />
        </DrawerContentScrollView>
    );
}


export const SideBarDrawer = memo(props => {
    const { user, group } = useContext(UserContext);

    if (user) {
        return (
            <Drawer.Navigator
                drawerContentOptions={{
                    activeTintColor: '#dd0031',
                    itemStyle: { marginVertical: 0 }
                }}
                initialRouteName={group.group_name} drawerType="slide" drawerContent={(_props) => itemsDrawer({ ..._props }, { user, group })}
            >
                <Drawer.Screen name="Moodem" component={P2PLanding} options={P2PLanding.navigationOptions} initialParams={{ user, group }} />
                <Drawer.Screen name="ChatRoom" component={ChatRoom} options={ChatRoom.navigationOptions} initialParams={{ user, group }} />
                <Drawer.Screen name="Groups" component={Groups} options={Groups.navigationOptions} initialParams={{ user, group }} />
                <Drawer.Screen name="Profile" component={Profile} options={Profile.navigationOptions} initialParams={{ group }} />
                {props.children}
            </Drawer.Navigator>
        );
    }
    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: '#dd0031',
                itemStyle: { marginVertical: 0 }
            }}
            initialRouteName={group.group_name} drawerType="slide" drawerContent={(_props) => itemsDrawer({ ..._props }, { user, group })}
        >
            <Drawer.Screen name="Moodem" component={P2PLanding} options={P2PLanding.navigationOptions} initialParams={{ user, group }} />
            <Drawer.Screen name="ChatRoom" component={ChatRoom} options={ChatRoom.navigationOptions} initialParams={{ user, group }} />
            <Drawer.Screen name="Groups" component={Groups} options={Groups.navigationOptions} initialParams={{ user, group }} />
            {props.children}
        </Drawer.Navigator>
    );
});

