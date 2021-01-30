/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { getUserName } = require('./users');
const { getConnectedInRoom, joinRoom } = require('./rooms');
const {
  voteMedia,
  boostMedia,
  removeMedia
} = require('./utils');

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

const videosList = [];
const chatRooms = {};
const clients = {};
let connectedUsers = 0;

function setRoomMediaList(room, data, media) {
  if (Object.keys(chatRooms).indexOf(room) >= 0) {
    if (media === 'song' && data[media].id) {
      chatRooms[room].songs.push(data[media]);
    } if (media === 'msg' && data[media].id) {
      chatRooms[room].messages.push(data[media]);
    }
  } else if (media === 'song') {
    chatRooms[room] = { songs: [] };
  } else if (media === 'msg') {
    chatRooms[room] = { messages: [] };
  }
}

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.on('connection', (socket) => {
  //io.engine.generateId = (req) => {
  //console.log('Engine', req);
  //};
  clients[socket.id] = socket;

  // Welcome Msg
  socket.on('server-send-message-welcomeMsg', (data) => {
    const userName = getUserName(data.displayName, socket.id);
    socket.username = userName;
    socket.emit('server-send-message-welcomeMsg', `Welcome ${userName} to ${data.chatRoom.replace(/(--.*)/g, '')} group!`);
  });

  // Media
  socket.on('send-message-media', (data) => {
    joinRoom(socket, data);
    setRoomMediaList(data.chatRoom, data, 'song');
    console.log('ROOOM', data.chatRoom);

    if (data.song) {
      io.to(data.chatRoom).emit('server-send-message-media', chatRooms[data.chatRoom].songs);
    } else if (data.video) {
      // eslint-disable-next-line no-unused-expressions
      data.video.id && videosList.push(data.video);
      io.to(data.chatRoom).emit('server-send-message-media', videosList);
    }
  });

  // Vote
  socket.on('send-message-vote', (data) => {
    joinRoom(socket, data);

    if (data.song) {
      voteMedia(chatRooms[data.chatRoom].songs, data, io, 'song');
    } else if (data.video) {
      voteMedia(videosList, data, io, 'video');
    }
  });

  // Boost
  socket.on('send-message-boost', (data) => {
    joinRoom(socket, data);

    if (data.song) {
      boostMedia(chatRooms[data.chatRoom].songs, data, io, 'song');
    } else if (data.video) {
      boostMedia(videosList, data, io, 'video');
    }
  });

  // Remove
  socket.on('send-message-remove', (data) => {
    joinRoom(socket, data);

    if (data.song) {
      removeMedia(chatRooms[data.chatRoom].songs, data, io, 'song');
    } else if (data.video) {
      removeMedia(videosList, data, io, 'video');
    }
  });

  // Joins moodem chat room
  socket.on('moodem-chat', (data) => {
    joinRoom(socket, data);
    setRoomMediaList(data.chatRoom, data, 'msg');

    connectedUsers = getConnectedInRoom(io.sockets.adapter.rooms, socket.room);

    console.log('DATTA MODEM CHAT', data.msg, 'AND CONNECTD', connectedUsers);

    if (!data.msg.isChatting) {
      io.to(data.chatRoom).emit('server-send-message-users-connected-to-room', connectedUsers);
      io.to(data.chatRoom).emit('server-send-message-moodem-chat', chatRooms[data.chatRoom].messages.slice().reverse());
    }
  });

  socket.on('chat-messages', (data) => {
    joinRoom(socket, data);

    if (data.msg) {
      setRoomMediaList(data.chatRoom, data, 'msg');
      console.log('SEND MESSAGE FROM SERVER');
      io.to(data.chatRoom).emit('server-send-message-chat-messages', data.msg);
    }
  });

  // User has disconected


  /* CAN JOIN MULTIPLE ROOMS
  ##########################
    socket.join(['room 237', 'room 238'], () => {
      const rooms = Object.keys(socket.rooms);
      console.log(rooms); // [ <socket.id>, 'room 237', 'room 238' ]
      io.to('room 237').to('room 238').emit('a new user has joined the room'); // broadcast to everyone in both rooms
    });
  */

  /* LEAVE ROOM
    socket.leave('room 237', () => {
      io.to('room 237').emit(`user ${socket.id} has left the room`);
    });
  */

  socket.on('disconnect', () => {
    connectedUsers = getConnectedInRoom(io.sockets.adapter.rooms, socket.room);
    console.log('DICSCONNNECT', connectedUsers);
    delete clients[socket.id];

    //io.to('moodem-chat').emit('server-send-message-users-connected-to-room', connectedUsers);

    //io.to(socket.room).emit('server-send-message-users-connected-to-room', `${socket.username} has left`);
  });
});

server.listen(3000, () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
