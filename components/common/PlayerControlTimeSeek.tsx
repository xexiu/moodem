/* tslint:disable:no-bitwise */
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

function timeFormat(time: number) {
    // Hours, minutes and seconds
    const hrs = ~~(time / 3600);
    const mins = ~~((time % 3600) / 60);
    const secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs > 0) {
        ret += `${hrs}:${(mins < 10 ? '0' : '')}`;
    }

    ret += `${mins}:${(secs < 10 ? '0' : '')}`;
    ret += '' + secs;
    return ret;
}
export const PlayerControlTimeSeek = (props: any) => {
    const {
        trackLength,
        currentPosition,
        onTouchMove,
        songIsReady
    } = props;
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(props.currentPosition);
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.text, { width: 40 }]}>
                    {timeFormat(currentPosition)}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.text}>
                    {timeFormat(trackLength - currentPosition)}
                </Text>
            </View>
            <Slider
                disabled={!songIsReady}
                onTouchMove={() => onTouchMove(value)}
                maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
                minimumValue={0}
                value={currentPosition}
                onValueChange={setValue}
                style={styles.slider}
                minimumTrackTintColor='#dd0031'
                maximumTrackTintColor='#ccc'
            />
        </View>
    );
};

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
        height: 50
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
} as any;
