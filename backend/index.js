/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

const tracksList = [];
const clients = [];
const user_id = 0;

const getUserName = (displayName, id) => (displayName !== 'Guest' ? displayName : `${displayName}_${id}`);

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.on('connection', (socket) => {
  //io.engine.generateId = (req) => {};
  // console.log('Engine', req);

  //console.log('Clients connected ====>', clients);

  socket.on('join-global-playList-moodem', data => {
    console.log('Im data from client', data);

    socket.join(data.chatRoom, () => {
      const userName = getUserName(data.displayName, socket.id);
      socket.username = userName;
      io.to('global-playList-moodem').emit('server-send-message-PlayListMoodem', `${userName} has joined!`);
    });
  });

  // Welcome Msg

  socket.on('server-send-message-welcomeMsg', (data) => {
    const userName = getUserName(data.displayName, socket.id);
    socket.username = userName;
    io.sockets.emit('server-send-message-welcomeMsg', `Welcome ${userName}!`);
  });

  // Track
  socket.on('send-message-track', (track) => {
    //socket.broadcast.to(clients[0].id).emit('update', 'for your eyes only' + msg);
    if (track) {
      tracksList.push(track);
    }
    io.to('global-playList-moodem').emit('server-send-message-track', tracksList);
  });

  // // Vote
  // socket.on('send-message-vote', (trackId, voteCount) => {
  //   tracksList.forEach(track => {
  //     if (track.id === trackId) {
  //       track.hasVoted = true;
  //       track.votes_count = voteCount;
  //     }
  //   });
  //   io.sockets.emit('server-send-message-vote', tracksList);
  // });

  // // Boost
  // socket.on('send-message-boost', (trackId, boostCount) => {
  //   tracksList.forEach(track => {
  //     if (track.id === trackId) {
  //       track.boosts_count = boostCount;
  //     }
  //   });
  //   io.sockets.emit('server-send-message-boost', tracksList);
  // });

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
