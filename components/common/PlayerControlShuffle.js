import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlShuffle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            shouldShuffle,
            onPressShuffle
        } = this.props;

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
                            onPressShuffle(shouldShuffle);
                        }} />
                </View>
                {
                    shouldShuffle &&
                    <View style={{ position: 'absolute', top: 5, left: -10, height: 15, width: 15}}>
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
        )
    }
}