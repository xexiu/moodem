import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import { Send } from 'react-native-gifted-chat';

const styles = {
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 10,
        marginLeft: 10
    }
};

const SendBtnChat = (props: any) => {
    const { attrs } = props;

    return (
        <Send
            {...attrs}
            containerStyle={styles.sendContainer}
        >
            <Icon
                name='send-o'
                type='font-awesome'
                color='#1E90FF'
                size={20}
            />
        </Send>
    );
};

function areEqual(prevProps: any, nextProps: any) {
    return prevProps.attrs.text.length === nextProps.attrs.text.length;
}

export default memo(SendBtnChat, areEqual);
