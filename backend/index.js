const app = require('express')();
const serverHTTP = require('http').Server(app);
const serverIO = require('socket.io')(serverHTTP);
const { initSentry } = require('./Utils/sentry');
const { MySocket } = require('./Utils/socket');

// initSentry()

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

serverIO.use((socket, next) => {
    this.mySocket = new MySocket(socket, serverIO);
    Object.assign(socket, {
        uid: socket.handshake.query.uid,
        displayName: socket.handshake.query.displayName
    });
    next(null, true);
});

serverIO.on('connection', async (socket) => {
    socket.on('app-goes-to-background', () => {
    // do nothing
        console.log('Onlineee');
    });
    socket.on('search-songs', this.mySocket.handleGetSearchedSongs);

    // Welcome Msg
    socket.on('emit-message-welcomeMsg', this.mySocket.handleGetWelcomeMsg);

    //  Song Error
    socket.on('send-song-error', this.mySocket.handleGetSongError);

    // Vote
    socket.on('send-message-vote-up', this.mySocket.handleGetSongVote);

    // Remove song
    socket.on('send-message-remove-song', this.mySocket.handleGetSongRemoved);

    // Add song
    socket.on('send-message-add-song', this.mySocket.handleGetSongAdded);

    // Get Connected Users on Chat Room
    socket.on('get-connected-users', this.mySocket.handleGetConnectedUsers);

    // Join Chat Room and get messages
    socket.on('moodem-chat', this.mySocket.handleGetChatRoomMsgs);

    // Get Chat Room Messages
    socket.on('chat-messages', this.mySocket.handleGetChatMsg);

    // User is Typing
    socket.on('user-typing', this.mySocket.hanldeGetUseIsTyping);

    // User has disconected
    socket.on('disconnect', (reason) => {
        console.log('DISCONNNECT SOCKET ID', socket.id, 'uid', socket.uid, 'With REASON', reason);
        socket.offAny();
        // eslint-disable-next-line no-param-reassign
        delete socket.id;
        // eslint-disable-next-line no-param-reassign
        delete socket.uid;
        // eslint-disable-next-line no-param-reassign
        delete socket.displayName;
    });
});

serverHTTP.listen(3000, '::', () => { // Digital Ocean Open Port
    console.log('listening on *:3000');
});
