export async function sendMsg(socket: any, user: any, message: any, chatRoom: string, deviceConfig?: any) {
    return socket.emit('get-chat-message',
        {
            chatRoom,
            msg: {
                badge: message.badge || 0,
                text: message.text,
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                    avatar: user.photoURL || '',
                    user_id: user.uid,
                    deviceToken: deviceConfig ? deviceConfig.token : null,
                    hasPushPermissions:  deviceConfig ? deviceConfig.hasPushPermissions : false
                },
                createdAt: message.createdAt,
                _id: message._id
            }
        });
}
