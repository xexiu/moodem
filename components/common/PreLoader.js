import React, { Component } from 'react';
import { View } from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { preloaderStyles } from '../../src/css/styles/components';
/* eslint-disable class-methods-use-this */

export class PreLoader extends Component {
    render() {
        return (
            <View style={{ marginTop: 4, paddingLeft: 5, paddingRight: 5 }}>
                <AnimatedProgressWheel
                    size={58}
                    progress={100}
                    animateFromValue={0}
                    duration={4000}
                    color={'white'}
                    fullColor={'#dd0031'}
                    onAnimationComplete={() => {
                        //this.props.updateLoader(false)
                    }}
                />
            </View>
        );
    }
}