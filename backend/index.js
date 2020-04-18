const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

const tracksList = [];
const clients = [];
let user_id = 1;

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.on('connection', function (socket) {
  io.engine.generateId = (req) => {
    //console.log('Engine', req)

    return user_id++;
  }
  console.log('a user connected ====>', socket.id);
  //console.log('Clients connected ====>', clients);

  socket.join('global-chat-room', () => {
    // let rooms = Object.keys(socket.rooms);
    // console.log(rooms); // [ <socket.id>, 'room 237' ]

    // Track
    socket.on('send-message-track', function (track) {
      //socket.broadcast.to(clients[0].id).emit('update', 'for your eyes only' + msg);
      if (track) {
        track.user['user_id'] = socket.id;
        tracksList.push(track);
      }
      io.to('global-chat-room').emit('server-send-message-track', tracksList);
    });

    // Vote
    socket.on('send-message-vote', function (trackId, voteCount) {
      tracksList.forEach(track => {
        if (track.id === trackId) {
          track.hasVoted = true;
          track.votes_count = voteCount;
        }
      });
      io.sockets.emit('server-send-message-vote', tracksList);
    });

    // Boost
    socket.on('send-message-boost', function (trackId, boostCount) {
      tracksList.forEach(track => {
        if (track.id === trackId) {
          track.boosts_count = boostCount;
        }
      });
      io.sockets.emit('server-send-message-boost', tracksList);
    });

    // User has disconected
    socket.on('disconnect', () => {
      console.log('user disconnected ====>', user_id);
      //clients.splice(user_id, 1);
      user_id--;
      console.log('Clients disconnected ====>', clients);
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

server.listen(3000, function () { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
