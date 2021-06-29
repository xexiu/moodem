export function sendMsg(socket: any, user: any, message: any, chatRoom: string) {
    return socket.emit('chat-messages',
        {
            chatRoom,
            msg: {
                text: message.text,
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                    avatar: user.photoURL || '',
                    user_id: user.uid
                },
                createdAt: message.createdAt,
                _id: message._id
            }
        });
}
