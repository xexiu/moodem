/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {
  voteMedia,
  boostMedia,
  removeMedia
} = require('./utils');

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

const videosList = [];
const chatRooms = {
  songs: [],
  messages: [],
  connectedUsers: 0
};
const clients = {};
const connections = new Set();

function buildMedia(data) {
  chatRooms[data.chatRoom] = {};

  Object.assign(chatRooms[data.chatRoom], {
    songs: [],
    messages: [],
    uids: new Set([])
  });
}

// function setRoomMediaList(room, data, media) {
//   console.log('HEYYYYY', chatRooms, 'ROOM:', room);
//   if (chatRooms[room]) {
//     if (media === 'song' && data[media].id) {
//       chatRooms[room].songs.push(data[media]);
//     } if (media === 'msg' && data[media].id) {
//       chatRooms[room].messages.push(data[media]);
//     }
//   }

//   console.log('FINALLL', chatRooms[room]);
// }

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.use((socket, next) => {
  socket.uid = socket.handshake.query.uid;
  socket.displayName = socket.handshake.query.displayName;
  next(null, true);
});

io.on('connection', (socket) => {
  // Welcome Msg
  console.log('CONNECTION ID', socket.id, 'SOCKET UID', socket.uid);
  socket.on('server-send-message-welcomeMsg', (data) => {
    socket.emit('server-send-message-welcomeMsg', `Welcome ${socket.displayName} to ${data.chatRoom.replace(/(--.*)/g, '')} group!`);
    socket.disconnect(true);
  });

  // // Media
  // socket.on('send-message-media', (data) => {
  //   joinRoom(socket, data);
  //   setRoomMediaList(data.chatRoom, data, 'song');
  //   console.log('ROOOM', data.chatRoom);

  //   if (data.song) {
  //     io.to(data.chatRoom).emit('server-send-message-media', chatRooms[data.chatRoom].songs);
  //   } else if (data.video) {
  //     // eslint-disable-next-line no-unused-expressions
  //     data.video.id && videosList.push(data.video);
  //     io.to(data.chatRoom).emit('server-send-message-media', videosList);
  //   }
  // });

  // // Vote
  // socket.on('send-message-vote', (data) => {
  //   joinRoom(socket, data);

  //   if (data.song) {
  //     voteMedia(chatRooms[data.chatRoom].songs, data, io, 'song');
  //   } else if (data.video) {
  //     voteMedia(videosList, data, io, 'video');
  //   }
  // });

  // // Boost
  // socket.on('send-message-boost', (data) => {
  //   joinRoom(socket, data);

  //   if (data.song) {
  //     boostMedia(chatRooms[data.chatRoom].songs, data, io, 'song');
  //   } else if (data.video) {
  //     boostMedia(videosList, data, io, 'video');
  //   }
  // });

  // // Remove
  // socket.on('send-message-remove', (data) => {
  //   joinRoom(socket, data);

  //   if (data.song) {
  //     removeMedia(chatRooms[data.chatRoom].songs, data, io, 'song');
  //   } else if (data.video) {
  //     removeMedia(videosList, data, io, 'video');
  //   }
  // });

  // Joins moodem chat room
  socket.on('get-connected-users', async (data) => {
    console.log('CONNECTED USERS', data);
    if (data.leaveChatRoom) {
      await socket.leave(data.leaveChatRoom);
      chatRooms[data.chatRoom].uids.delete(socket.uid);
      socket.disconnect(true);
      io.to(data.chatRoom).emit('server-send-message-users-connected-to-room', chatRooms[data.chatRoom].uids.size);
    } else {
      await socket.join(data.chatRoom);
      chatRooms[data.chatRoom].uids.add(socket.uid);
      io.to(data.chatRoom).emit('server-send-message-users-connected-to-room', chatRooms[data.chatRoom].uids.size);
    }
  });

  socket.on('moodem-chat', async (data) => {
    await socket.join(data.chatRoom);

    if (!chatRooms[data.chatRoom]) {
      buildMedia(data);
      chatRooms[data.chatRoom].uids.add(socket.uid);
    } else {
      chatRooms[data.chatRoom].uids.add(socket.uid);
    }

    io.to(data.chatRoom).emit('server-send-message-moodem-chat', chatRooms[data.chatRoom].messages.slice().reverse());
  });

  socket.on('chat-messages', (data) => {
    console.log('CHAT MESSAGES', chatRooms[data.chatRoom]);

    if (data.msg) {
      chatRooms[data.chatRoom].messages.push(data.msg);
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

  // socket.on('disconnect', () => {
  //   console.log('DICSCONNNECT', socket.room);
  //   console.log('DICSCONNNECT 2', io.sockets.adapter.rooms);
  //   // socket.removeAllListeners('send message');
  //   // socket.removeAllListeners('disconnect');
  //   // io.removeAllListeners('connection');
  //   delete clients[socket.id];
  //   connections.delete(socket);

  //   //io.to('moodem-chat').emit('server-send-message-users-connected-to-room', connectedUsers);

  //   //io.to(socket.room).emit('server-send-message-users-connected-to-room', `${socket.username} has left`);
  // });

  socket.on('disconnect', () => {
    console.log('DISCONNNECT', socket.id);
    socket.removeAllListeners();
  });
});

server.listen(3000, () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
