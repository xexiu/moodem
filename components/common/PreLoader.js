import React, { Component } from 'react';
import { View } from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import { preloaderStyles } from '../../src/css/styles/components';
/* eslint-disable class-methods-use-this */

export class PreLoader extends Component {
    render() {
        return (
            <View style={preloaderStyles}>
                <AnimatedProgressWheel
                    size={30}
                    progress={100}
                    animateFromValue={0}
                    duration={1000}
                    color={'white'}
                    fullColor={'red'}
                    onAnimationComplete={() => {
                        this.props.updateLoader(false)
                    }}
                />
            </View>
        );
    }
}