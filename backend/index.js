/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { getUserName } = require('./users');
const { getConnectedInRoom } = require('./rooms');

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

function compareValues(key) {
  return function innerSort(a, b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    if (varA > varB) {
      return -1;
    } else if (varA < varB) {
      return 1;
    }

    return 0;
  };
}

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
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
      // io.to(data.chatRoom).emit('global-moodem-songsPlaylist', 'Test');
      // io.sockets.emit('server-send-message-video', videos);
    });
    socket.room = data.chatRoom;

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
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
    });
    socket.room = data.chatRoom;

    if (data.song) {
      songsList.forEach(song => {
        if (song.id === data.songId) {
          song.hasVoted = true;
          song.votes_count = data.count;
        }
      });

      songsList.sort(compareValues('votes_count'));
      io.to(data.chatRoom).emit('server-send-message-vote', songsList);
    } else if (data.video) {
      videosList.forEach(video => {
        if (video.id === data.videoId) {
          video.hasVoted = true;
          video.votes_count = data.count;
        }
      });
      videosList.sort(compareValues('votes_count'));
      io.to(data.chatRoom).emit('server-send-message-vote', videosList);
    }
  });

  // Boost
  socket.on('send-message-boost', (data) => {
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
    });
    socket.room = data.chatRoom;

    if (data.song) {
      songsList.forEach(song => {
        if (song.id === data.songId) {
          song.hasBoosted = true;
          song.boosts_count = data.count;
        }
      });
      songsList.sort(compareValues('votes_count'));
      io.to(data.chatRoom).emit('server-send-message-boost', songsList);
    } else if (data.video) {
      videosList.forEach(video => {
        if (video.id === data.videoId) {
          video.hasBoosted = true;
          video.boosts_count = data.count;
        }
      });
      videosList.sort(compareValues('votes_count'));
      io.to(data.chatRoom).emit('server-send-message-boost', videosList);
    }
  });

  // Remove
  socket.on('send-message-remove', (data) => {
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
    });
    socket.room = data.chatRoom;

    if (data.song) {
      songsList.forEach((song, index) => {
        if (song.id === data.songId) {
          songsList.splice(index, 1);
        }
      });
      io.to(data.chatRoom).emit('server-send-message-remove', songsList);
    } else if (data.video) {
      videosList.forEach((video, index) => {
        if (video.id === data.videoId) {
          videosList.splice(index, 1);
        }
      });
      io.to(data.chatRoom).emit('server-send-message-remove', videosList);
    }
  });

  // Joins moodem chat room
  socket.on('moodem-chat', (data) => {
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
      socket.room = data.chatRoom;
      io.to(data.chatRoom).emit('server-send-message-users-connected-to-room', getConnectedInRoom(io.sockets.adapter.rooms, socket.room));
    });

    if (data.msg) {
      // eslint-disable-next-line no-unused-expressions
      data.msg.id && messagesList.push(data.msg);
      //socket.broadcast.to(data.chatRoom).emit('server-send-message-moodem-chat', messagesList);
      io.to(data.chatRoom).emit('server-send-message-moodem-chat', messagesList.reverse());
    }
  });

  socket.on('chat-messages', (data) => {
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
      socket.room = data.chatRoom;
    });

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
