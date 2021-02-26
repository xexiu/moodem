import React, { memo } from 'react';
import { View } from 'react-native';
import { MediaListEmpty } from '../../screens/User/functional-components/MediaListEmpty';

const PlayerContainer = (props: any) => {
    const {
        children,
        items
    } = props;

    if (items && !items.length) {
        return (<MediaListEmpty />);
    }

    return (
        <View style={[{ marginLeft: 10, marginRight: 10, position: 'relative' }]}>
            {children}
        </View>
    );
};

memo(PlayerContainer);

export { PlayerContainer };
