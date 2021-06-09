import React, { memo } from 'react';
import { Icon } from 'react-native-elements';

const PlayerControlFullScreen = (props: any) => {
    const {
        basePlayer
    } = props;

    function enterFullScreen() {
        return basePlayer.current.presentFullscreenPlayer();
    }

    return (
        <Icon
            containerStyle={{ position: 'absolute', top: 70, right: 50, zIndex: 100 }}
            raised={false}
            reverse={false}
            iconStyle={{
                borderWidth: 1,
                borderColor: '#eee',
                borderRadius: 15,
                padding: 5,
                backgroundColor: '#fff'
            }}
            name='resize-full-screen'
            type='entypo'
            color='#dd0031'
            size={18}
            onPress={enterFullScreen}
        />
    );
};

const areEqual = () => {
    return true;
};

export default memo(PlayerControlFullScreen, areEqual);
