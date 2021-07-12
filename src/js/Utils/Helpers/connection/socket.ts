export async function sendMsg(socket: any, user: any, message: any, chatRoom: string) {
    return socket.emit('get-chat-message',
        {
            chatRoom,
            msg: {
                text: message.text,
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                    avatar: user.photoURL || '',
                    user_id: user.uid,
                    deviceToken: user.deviceConfig ? user.deviceConfig?.token : null,
                    hasPushPermissions:  user.deviceConfig ? user.deviceConfig?.hasPushPermissions : false
                },
                createdAt: message.createdAt,
                _id: message._id
            }
        });
}
