import React from 'react';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export const PlayerControlRepeat = (props) => {
    const {
        shouldRepeat,
        onPressRepeat
    } = props;

    return (
        <View style={{ position: 'relative' }}>
            <View>
                <Icon
                    iconStyle={{ marginTop: 20, marginLeft: 20 }}
                    Component={TouchableScale}
                    name='repeat'
                    type='font-awesome'
                    color='#777'
                    size={24}
                    onPress={() => {
                        onPressRepeat(shouldRepeat);
                    }}
                />
            </View>
            {
                shouldRepeat &&
                <View style={{ position: 'absolute', top: 5, right: 0, height: 15, width: 15 }}>
                    <Icon
                        Component={TouchableScale}
                        name='dot-single'
                        type='entypo'
                        color='#dd0031'
                        size={25}
                    />
                </View>
            }
        </View>
    );
};
