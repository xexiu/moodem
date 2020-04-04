import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

export class PlayerControlPlayPause extends Component {
    constructor(props){
        super(props);

        this.state = {
            isPlayButton: true
        }
    }
    render() {
        const {
            isPlayButton
        } = this.state;

        return (
            <Icon
                Component={TouchableScale}
                raised
                name={isPlayButton ? 'play' : 'pause'}
                type={isPlayButton ? 'foundation' : 'AntDesign'}
                size={25}
                color='#dd0031'
                onPress={() => {
                    console.log('Pressed Play Control Player - remeber to pause');
                    this.setState({
                        isPlayButton: !isPlayButton
                    })
                }} />
        )
    }
}