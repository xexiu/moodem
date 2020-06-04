/* eslint-disable max-len */
import React, { Component } from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { View, Keyboard } from 'react-native';
import { getGroupName } from '../../../src/js/Utils/Helpers/actions/groups';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';
import { CommonFlatList } from '../../common/functional-components/CommonFlatList';
import { MessagesListItem } from '../functional-components/MessagesListItem';
import { HeaderChat } from '../functional-components/HeaderChat';
import { CommonTextInput } from '../../common/functional-components/CommonTextInput';
import { BurgerMenuIcon } from '../../common/BurgerMenuIcon';

const buildMsg = (value, user) => ({
    id: `${user.uid}_${Math.random()}`,
    text: value.replace(/^\s*\n/gm, ''),
    user
});

export class ChatRoom extends Component {
    static navigationOptions = ({ route }) => ({
        unmountOnBlur: true,
        headerBackTitle: '',
        title: getGroupName(route.params.group.group_name, 'Chat Room')
    })

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            usersConnected: 0
        };
        this.messageRef = React.createRef();
        this.media = new MediaBuilder();
        this.socket = this.media.socket();
        this.user = this.props.route.params.user;
        this.headerTitle = getGroupName(this.props.route.params.group.group_name, 'Chat Room');
    }

    componentDidMount() {
        this.media.msgFromServer(this.socket, this.getMessage, ['chat-messages']);
        this.media.msgFromServer(this.socket, this.setMessageList, ['moodem-chat']);
        this.media.msgFromServer(this.socket, this.getConnectedUsers, ['users-connected-to-room']);
        this.media.msgToServer(this.socket, 'moodem-chat', { chatRoom: 'moodem-chat-room', msg: true, user: this.user || { displayName: 'Guest' } });
    }

    componentWillUnmount() {
        this.socket.off(this.getMessage);
        this.socket.off(this.setMessageList);
        this.socket.close();
        this.media.off(this.socket);
    }

    getConnectedUsers = (usersConnected) => {
        // eslint-disable-next-line no-unused-expressions
        if (usersConnected) {
            this.setState({ usersConnected });
        }
    }

    getMessage = (msg) => {
        this.setState({
            messages: [msg, ...this.state.messages]
        });
    };

    setMessageList = (messagesList) => {
        this.setState({
            messages: [...messagesList]
        });
    };

    sendNewMsg = (value) => {
        this.media.msgToServer(this.socket, 'chat-messages', { chatRoom: 'moodem-chat-room', msg: buildMsg(value, this.user) });
    }

    renderItem = ({ item }) => (
        <MessagesListItem msg={item} />
    );

    render() {
        const { messages, usersConnected } = this.state;
        const { navigation } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', flex: 1, position: 'relative' }}>
                <BurgerMenuIcon
                    action={() => {
                        navigation.openDrawer();
                        Keyboard.dismiss();
                    }}
                />
                <HeaderChat headerTitle={this.headerTitle} usersConnected={usersConnected} />
                <View style={{ flex: 2, paddingBottom: 60 }}>
                    <View style={{ position: 'absolute', bottom: 10, right: 0, left: 7, width: '96%', zIndex: 1 }}>
                        <CommonTextInput navigation={navigation} user={this.user} callback={this.sendNewMsg} />
                    </View>
                    <CommonFlatList
                        data={messages}
                        keyExtractor={item => String(item.id)}
                        inverted
                        action={this.renderItem}
                    />
                </View>
                <KeyboardSpacer />
            </View>
        );
    }
}
