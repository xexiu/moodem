import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

function timeFormat(time) {
    // Hours, minutes and seconds
    const hrs = ~~(time / 3600);
    const mins = ~~((time % 3600) / 60);
    const secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
export class PlayerControlTimeSeek extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.currentPosition
        }
    }
    render() {
        const {
            trackLength,
            currentPosition,
            onSeek,
            onSlidingStart,
            onTouchMove
        } = this.props;
        const {
            value
        } = this.state;

        const songTimg = timeFormat(value);

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.text, { width: 40 }]}>
                        {timeFormat(currentPosition)}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.text}>
                        {timeFormat(trackLength)}
                    </Text>
                </View>
                <Slider
                    onTouchMove={() => {
                        console.log('Slider')
                        onTouchMove();
                    }}
                    maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
                    onSlidingStart={onSlidingStart}
                    onSlidingComplete={onSeek}
                    value={currentPosition}
                    onValueChange={value => this.setState({ value: value })}
                    style={styles.slider}
                    minimumTrackTintColor='#dd0031'
                    maximumTrackTintColor='#ccc'
                    thumbStyle={styles.thumb}
                    trackStyle={styles.track} />
            </View>
        );
    }
}

const styles = {
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    text: {
        color: '#dd0031',
        fontSize: 12,
        textAlign: 'center'
    },
    slider: {
    },
    thumb: {
        borderWidth: 1,
        color: 'green',
        backgroundColor: '#dd0031'
    },
    track: {
        borderWidth: 1,
        color: 'blue',
        backgroundColor: '#dd0031'
    }
};