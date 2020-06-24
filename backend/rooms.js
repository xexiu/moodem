/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const { getUserName } = require('./users');

const getConnectedInRoom = (sockets, roomName) => !!roomName && sockets[roomName] && sockets[roomName].length;

const joinRoom = (socket = {}, data = {}) => {
    socket.join(data.chatRoom, () => {
        const userName = getUserName(data.displayName, socket.id);
        socket.username = userName;
    });

    socket.room = data.chatRoom; // This must be outside of the above method --> socket.join
};

module.exports = { getConnectedInRoom, joinRoom };
