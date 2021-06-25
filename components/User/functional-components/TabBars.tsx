import React, { memo, useCallback, useState } from 'react';
import { Dimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import MyGroupsSceneTab from './MyGroupsSceneTab';
import PrivateGroupsSceneTab from './PrivateGroupsSceneTab';
import PublicGroupsSceneTab from './PublicGroupsSceneTab';
import TabBar from './TabBar';

const TabBars = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: `${translate('groups.itemsBars.titles.0')}` },
        { key: 'second', title: `${translate('groups.itemsBars.titles.1')}` },
        { key: 'third', title: `${translate('groups.itemsBars.titles.2')}` }
    ]);

    const renderScene = useCallback((props: any) => {
        switch (props.route.key) {
        case 'first':
            return <MyGroupsSceneTab />;
        case 'second':
            return <PublicGroupsSceneTab />;
        case 'third':
            return <PrivateGroupsSceneTab />;
        default:
            return null;
        }
    }, []);

    const renderTabBar = useCallback(props => {
        return (
            <TabBar {...props} />
        );
    }, []);

    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
        />
    );
};

export default memo(TabBars);
