import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlPlayPause extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const {
            isPlaying,
            onPressPlayPause
        } = this.props;

        return (
            <Icon
                Component={TouchableScale}
                raised
                name={isPlaying ? 'pause' : 'play'}
                type={isPlaying ? 'AntDesign' : 'foundation'}
                size={25}
                color='#dd0031'
                onPress={() => {
                    onPressPlayPause(isPlaying);
                }} />
        )
    }
}