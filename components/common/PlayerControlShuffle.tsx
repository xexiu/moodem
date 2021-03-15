/* eslint-disable max-len */
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const PlayerControlShuffle = (props: any) => {
    const {
        tracks,
        onPressShuffle
    } = props;

    const [shouldShuffle, setShouldShuffle] = useState(false);

    useEffect(() => {
        console.log('UseEffect shouldshuffle');
        return () => {
            console.log('OFF Effect should shffle');
        };
    }, []);

    // console.log('Should shuffle', shouldShuffle);

    return (
        <View style={{ position: 'relative' }}>
            <View>
                <Icon
                    iconStyle={{ marginTop: 20, marginRight: 20 }}
                    Component={TouchableScale}
                    name='random'
                    type='font-awesome'
                    color='#777'
                    onPress={() => {
                        const random = Math.floor((Math.random() * tracks.length) + 0);
                        console.log('Press shuffle button');
                        setShouldShuffle(!shouldShuffle);
                        onPressShuffle(shouldShuffle, random);
                    }}
                />
            </View>
            {
                shouldShuffle &&
                <View style={{ position: 'absolute', top: 5, left: -10, height: 15, width: 15 }}>
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

export default memo(PlayerControlShuffle);
