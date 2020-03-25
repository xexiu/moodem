import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
/* eslint-disable class-methods-use-this */

// check local storage
// if token exists then set state with token
// else set token to null

// debugger;
// const headers = { "Authorization": "Bearer " + data.access_token };
//     fetch('https://api.spotify.com/v1/search?q=calladita&type=track,playlist&limit=10', {
//       headers
//     })
//       .then(resp => {
//         debugger;
//         return resp.json();
//       })
//       .then(data => {
//         debugger;
//       });

let e;
export class P2PLanding extends Component {
    constructor(props) {
        super(props);
        e = this;

        this.socket = io('https://5136817f.ngrok.io', {
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: 15
        });

        this.state = {
            isConnected: false,
            data: null,
            messages: [],
            text: ''
        }

        this.socket.on('server-send-message', function(data) {
            console.log('Data received from Server', data);
            e.setState({
                text: data
            });
        });
    }

    _sendPing() {
        //emit a dong message to socket server
        debugger;
        socket.emit('ding');
    }

    _getReply(data) {
        //get reply from socket server, log it to console
        debugger;
        console.log('Reply from server:' + data);
        // this.setState(previousState => ({
        //     messages: GiftedChat.append(previousState.messages, data),
        // }))
    }

    componentDidMount() {
        console.log('Called componentDidMount()')

        this.socket.on('connect', function (socket) {
            debugger;
            console.log('SocketID-Connect', socket);
            this.socket.emit('i-am-connected');
        }.bind(this));
        this.socket.on('connection', function (socket) {
            debugger;
            console.log('SocketID-connection', socket);
        })
        // this.socket.on('ping', (data) => {
        //     debugger;
        //     console.log('Reply from server:' + data)
        // });
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, this.state.messages),
        }));
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ],
        })
    }

    onSend(messages = []) {
        debugger;
        this.socket.on('event', this._getReply(messages[0].text));
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        //this.componentDidMount();
    }

    clickme(){
        console.log('Pressed')
        this.socket.emit('send-message', this.state.text);
    }

    render() {
        console.log('Called render()')
        return (
            <View style={{ width: '100%', alignSelf: 'stretch', textAlign: 'center', backgroundColor: '#FDD7E4', justifyContent: 'center', flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <Text>Token (_id): {this.props.token.slice(0, 6)}</Text>
                        <Text>Text: {this.state.text}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', alignSelf: 'stretch', textAlign: 'center', backgroundColor: '#FDD7E4', justifyContent: 'center', flex: 6 }}>
                    <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1 }} onChangeText={text => this.setState({ text })} value={this.state.text} />
                    {/* <GiftedChat
                        style={{ width: '100%', alignSelf: 'stretch', textAlign: 'center', backgroundColor: '#FDD7E4', justifyContent: 'center', flex: 1 }}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: this.props.token.slice(0, 6),
                            name: 'Matt ' + Math.random()
                        }}
                    /> */}
                    <TouchableOpacity onPress={() => this.clickme()}>
                        <Text>Send Text</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
});