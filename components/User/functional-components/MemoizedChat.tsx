import dayjs from 'dayjs';
import 'dayjs/locale/es';
import React, { memo } from 'react';
import { hasNotch } from 'react-native-device-info';
import { GiftedChat } from 'react-native-gifted-chat';

const MemoizedChat = (props: any) => {
    const {
        onPressAvatar,
        messages,
        user,
        memoizedRenderSendBtn,
        memoizedOnSend
    } = props;

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
            placeholder='Escribe algo...'
            infiniteScroll
            renderUsernameOnMessage
            showAvatarForEveryMessage
            messages={messages}
            renderSend={(attrs) => memoizedRenderSendBtn(attrs)}
            onSend={(msgs) => memoizedOnSend(msgs[0])}
            keyboardShouldPersistTaps='always'
            showUserAvatar
            inverted
            user={{
                _id: user.uid,
                name: user.displayName
            }}
        />
    );
};

export default memo(MemoizedChat);
