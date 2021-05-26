import dayjs from 'dayjs';
import 'dayjs/locale/es';
import React, { memo } from 'react';
import DeviceInfo from 'react-native-device-info';
import { GiftedChat } from 'react-native-gifted-chat';

const MemoizedChat = (props: any) => {
    const {
        onPressAvatar,
        messages,
        user,
        memoizedRenderSendBtn,
        memoizedOnSend
    } = props;

    function setOffset() {
        const model = DeviceInfo.getModel();

        if (model.indexOf('iPhone 12') >= 0) {
            return 30;
        }
        return 0;
    }

    return (
        <GiftedChat
            // isTyping
            onPressAvatar={() => onPressAvatar()}
            bottomOffset={setOffset()}
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
