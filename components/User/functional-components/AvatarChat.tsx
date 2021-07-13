import React, { memo, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { avatarChat } from '../../../src/css/styles/avatar';
import { AppContext } from '../store-context/AppContext';

function defaultPressChatAvatar() {}

const AvatarChat = ({ currentMessage, onPressAvatar = defaultPressChatAvatar, disablePressAvatar = false }: any) => {
    const { user }: any = useContext(AppContext);

    if (disablePressAvatar || currentMessage.user._id === user.uid) {
        return (
            <FastImage
                style={avatarChat}
                source={{
                    uri: currentMessage.user.avatar,
                    priority: FastImage.priority.high
                }}
            />
        );
    }

    return (
        <TouchableOpacity
            onPress={() => onPressAvatar()}
            disabled={disablePressAvatar}
        >
            <FastImage
                style={avatarChat}
                source={{
                    uri: currentMessage.user.avatar,
                    priority: FastImage.priority.high
                }}
            />
        </TouchableOpacity>
    );
};

export default memo(AvatarChat);
