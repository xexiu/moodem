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

const songsList = [];
const videosList = [];
const messagesList = [];

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.on('connection', (socket) => {
  //io.engine.generateId = (req) => {};
  // console.log('Engine', req);

  // Welcome Msg
  socket.on('server-send-message-welcomeMsg', (data) => {
    const userName = getUserName(data.displayName, socket.id);
    socket.username = userName;
    socket.emit('server-send-message-welcomeMsg', `Welcome ${userName}!`);
  });

  // Media
  socket.on('send-message-media', (data) => {
    joinRoom(socket, data);

    if (data.song) {
      // eslint-disable-next-line no-unused-expressions
      data.song.id && songsList.push(data.song);
      io.to(data.chatRoom).emit('server-send-message-media', songsList);
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
      voteMedia(songsList, data, io, 'song');
    } else if (data.video) {
      voteMedia(videosList, data, io, 'video');
    }
  });

  // Boost
  socket.on('send-message-boost', (data) => {
    joinRoom(socket, data);

    if (data.song) {
      boostMedia(songsList, data, io, 'song');
    } else if (data.video) {
      boostMedia(videosList, data, io, 'video');
    }
  });

  // Remove
  socket.on('send-message-remove', (data) => {
    joinRoom(socket, data);

    if (data.song) {
      removeMedia(songsList, data, io, 'song');
    } else if (data.video) {
      removeMedia(videosList, data, io, 'video');
    }
  });

  // Joins moodem chat room
  socket.on('moodem-chat', (data) => {
    joinRoom(socket, data);

    io.to(data.chatRoom).emit('server-send-message-users-connected-to-room', getConnectedInRoom(io.sockets.adapter.rooms, socket.room));

    if (data.msg) {
      // eslint-disable-next-line no-unused-expressions
      data.msg.id && messagesList.push(data.msg);
      //socket.broadcast.to(data.chatRoom).emit('server-send-message-moodem-chat', messagesList);
      io.to(data.chatRoom).emit('server-send-message-moodem-chat', messagesList.reverse());
    }
  });

  socket.on('chat-messages', (data) => {
    joinRoom(socket, data);

    if (data.msg) {
      // eslint-disable-next-line no-unused-expressions
      data.msg.id && messagesList.push(data.msg);
      //socket.broadcast.to(data.chatRoom).emit('server-send-message-moodem-chat', messagesList);
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

  socket.on('disconnect', (data) => {
    const userName = getUserName(data.displayName, socket.id);
    socket.username = userName;
    const connectionMessage = `${socket.username} Disconnected from Socket ${socket.id}`;
    io.to('moodem-chat-room').emit('server-send-message-users-connected-to-room', getConnectedInRoom(io.sockets.adapter.rooms, socket.room));
    console.log(connectionMessage, 'and data is: ', socket.room);
  });
});

server.listen(3000, () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
