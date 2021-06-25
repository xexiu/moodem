import dayjs from 'dayjs';
import 'dayjs/locale/es';
import React, { memo } from 'react';
import { hasNotch } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { GiftedChat } from 'react-native-gifted-chat';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

const DEFAULT_AVATAR_STYLE = {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10
};

const MemoizedChat = (props: any) => {
    const {
        onPressAvatar,
        messages,
        user,
        memoizedRenderSendBtn,
        memoizedOnSend
    } = props;

    function renderAvatar() {
        return (
            <FastImage
                style={DEFAULT_AVATAR_STYLE}
                source={{
                    uri: user.photoURL,
                    priority: FastImage.priority.high
                }}
            />
        );
    }

    return (
        <GiftedChat
            // isTyping
            onPressAvatar={() => onPressAvatar()}
            bottomOffset={hasNotch() ? 30 : 0}
            maxComposerHeight={200}
            minInputToolbarHeight={40}
            maxInputLength={1000}
            locale={dayjs.locale('es')}
            wrapInSafeArea
            loadEarlier
            placeholder={translate('chat.placeHolderChatButton')}
            infiniteScroll
            renderUsernameOnMessage
            showAvatarForEveryMessage
            messages={messages}
            renderSend={(attrs) => memoizedRenderSendBtn(attrs)}
            onSend={(msgs) => memoizedOnSend(msgs[0])}
            keyboardShouldPersistTaps='always'
            showUserAvatar
            inverted
            renderAvatar={renderAvatar}
            user={{
                _id: user.uid,
                name: user.displayName
            }}
        />
    );
};

export default memo(MemoizedChat);
