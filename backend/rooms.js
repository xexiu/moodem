/* eslint-disable max-len */
const getConnectedInRoom = (sockets, roomName) => !!roomName && sockets[roomName] && sockets[roomName].length;

module.exports = { getConnectedInRoom };
