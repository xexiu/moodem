/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

const songsList = [];
const videosList = [];

const getUserName = (displayName, id) => (displayName !== 'Guest' ? displayName : `${displayName}_${id}`);

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
    console.log('Im data from client', data);
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
      // io.to(data.chatRoom).emit('global-moodem-songsPlaylist', 'Test');
      // io.sockets.emit('server-send-message-video', videos);
    });

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

    if (data.song) {
      songsList.forEach(song => {
        if (song.id === data.songId) {
          song.hasVoted = true;
          song.votes_count = data.count;
        }
      });
      io.to(data.chatRoom).emit('server-send-message-vote', songsList);
    } else if (data.video) {
      videosList.forEach(video => {
        if (video.id === data.videoId) {
          video.hasVoted = true;
          video.votes_count = data.count;
        }
      });
      io.to(data.chatRoom).emit('server-send-message-vote', videosList);
    }
  });

  // Boost
  socket.on('send-message-boost', (data) => {
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
    });

    if (data.song) {
      songsList.forEach(song => {
        if (song.id === data.songId) {
          song.hasBoosted = true;
          song.boosts_count = data.count;
        }
      });
      io.to(data.chatRoom).emit('server-send-message-boost', songsList);
    } else if (data.video) {
      videosList.forEach(video => {
        if (video.id === data.videoId) {
          video.hasBoosted = true;
          video.boosts_count = data.count;
        }
      });
      io.to(data.chatRoom).emit('server-send-message-boost', videosList);
    }
  });

  // Removoe
  socket.on('send-message-remove', (data) => {
    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
    });

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
    const connectionMessage = `${socket.username} Disconnected from Socket ${socket.id}`;
    console.log(connectionMessage);
  });
});

server.listen(3000, () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
