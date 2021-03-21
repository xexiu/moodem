/* tslint:disable:no-bitwise */
import Slider from '@react-native-community/slider';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../src/css/styles/playerControlTimeSeek';

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

type MyProps = {
    basePlayer: any,
    currentSong: any
};

const PlayerControlTimeSeek = forwardRef((props: MyProps, ref: any) => {
    const {
        basePlayer,
        currentSong
    } = props;

    const [trackCurrentTime, setTrackCurrentTime] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const sliderRef = useRef();

    useEffect(() => {
        setTrackCurrentTime(0);
        return () => {};
    }, []);

    useImperativeHandle(ref, () => {
        return {
            setTrackCurrentTime,
            setIsSliding,
            isSliding,
            trackCurrentTime
        };
    }, [isSliding, trackCurrentTime]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.text, { width: 40, textAlign: 'left' }]}>
                    {timeFormat(trackCurrentTime)}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.text}>
                    {timeFormat(Number(currentSong.videoDetails.lengthSeconds) - trackCurrentTime)}
                </Text>
            </View>
            <Slider
                step={1}
                ref={sliderRef}
                maximumValue={Number(currentSong.videoDetails.lengthSeconds)}
                minimumValue={0}
                value={trackCurrentTime}
                style={styles.slider}
                onValueChange={(_value) => {
                    setIsSliding(true);
                    setTrackCurrentTime(_value);
                }}
                minimumTrackTintColor={styles.minimumTrackTintColor}
                maximumTrackTintColor={styles.maximumTrackTintColor}
                onSlidingComplete={(_value) => {
                    basePlayer.current.seek(_value);
                    setIsSliding(false);
                }}
            />
        </View>
    );
});

const prevNextSongIsPlaying = (prevProps: any, nextProps: any) => {
    return prevProps.currentSong.isPlaying === nextProps.currentSong.isPlaying;
};

const nextPrevSongIndex = (prevProps: any, nextProps: any) => {
    return prevProps.currentSong.index !== nextProps.currentSong.index &&
    nextProps.currentSong.isPlaying;
};

const areEqual = (prevProps: any, nextProps: any) => {
    if (prevNextSongIsPlaying(prevProps, nextProps)) {
        return false;
    } else if (nextPrevSongIndex(prevProps, nextProps)) {
        return false;
    }
    return true;
};

export default memo(PlayerControlTimeSeek, areEqual);
