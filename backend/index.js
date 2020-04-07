const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

io.on('connection', function (client) {
  console.log('a user connected ====>', client.id);
  client.on('send-message', function (name, artists, album) {
    io.sockets.emit('server-send-message', name, artists, album);
  });
});

server.listen(3000, function () {
  console.log('listening on *:3000');
});
