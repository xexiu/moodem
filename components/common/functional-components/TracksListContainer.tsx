import React, { memo } from 'react';
import { View } from 'react-native';

const TracksListContainer = (props: any) => {

    return (
        <View style={[{ flex: 1, position: 'relative' }]}>
            {props.children}
        </View>
    );
};

memo(TracksListContainer);
export { TracksListContainer };
