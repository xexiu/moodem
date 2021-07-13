import React from 'react';
import { Icon } from 'react-native-elements';

const NavigationOptions = (navigation: any) => {

    const COMMON_NAVIGATION_OPTIONS = {
        headerMode: 'none',
        unmountOnBlur: true,
        headerBackTitleVisible: false,
        unmountInactiveRoutes: true,
        headerBackImage: () => <Icon
            name='chevron-left'
            size={40}
            onPress={() => navigation.goBack()}
        />
    };

    return COMMON_NAVIGATION_OPTIONS;
};

export {
    NavigationOptions
};
