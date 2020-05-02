const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

const tracksList = [];
const clients = [];
const user_id = 0;

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.on('connection', (socket) => {
  //io.engine.generateId = (req) => {};
  // console.log('Engine', req);

  console.log('a user connected ====>', socket.id);
  //console.log('Clients connected ====>', clients);

  socket.on('join-global-playList-moodem', data => {
    console.log('Im data from server 2', data);

    socket.join(data.chatRoom, () => {
      io.to('global-playList-moodem').emit('server-send-message-PlayListMoodem', `${data.user.displayName ? data.user.displayName : data.user} has joined!`);
    });
  });

  socket.join('global-playList-moodem', () => {
    // let rooms = Object.keys(socket.rooms);
    // console.log(rooms); // [ <socket.id>, 'room 237' ]

    //io.sockets.emit('join-global-playList-moodem', 'TEST');
    io.to('global-playList-moodem').emit('server-send-message-PlayListMoodem', `Guest_${socket.id} has joined!`);

    // // Track
    // socket.on('send-message-track', (track) => {
    //   //socket.broadcast.to(clients[0].id).emit('update', 'for your eyes only' + msg);
    //   if (track) {
    //     track.user.user_id = socket.id;
    //     tracksList.push(track);
    //   }
    //   io.to('global-chat-room').emit('server-send-message-track', tracksList);
    // });

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
    socket.on('disconnect', () => {
      console.log('User disconnected ====>', socket.id);
      //console.log('Clients disconnected ====>', clients);
    });
  });


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
});

server.listen(3000, () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
