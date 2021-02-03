/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const { getUserName } = require('./users');

const getConnectedInRoom = (rooms, roomName) => {
    const clients = rooms.get(roomName);

    if (clients) {
        return Array.from(clients).length;
    }

    return 0;
};

const joinRoom = (socket = {}, data = {}) => {
    socket.join(data.chatRoom);

    //console.log('DATTA USER', data.user);

    Object.assign(socket, {
        username: getUserName(data.user ? data.user.displayName : 'Unknown', socket.id),
        room: data.chatRoom // This must be outside of the above method --> socket.join
    });
};

module.exports = { getConnectedInRoom, joinRoom };
