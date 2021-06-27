const app = require('express')();
const serverHTTP = require('http').Server(app);
const serverIO = require('socket.io')(serverHTTP);
const { initSentry } = require('./Utils/sentry');
const {
    getSearchedSongs,
    getWelcomeMsg,
    getSongError,
    getSongVote,
    getSongRemoved,
    getSongAdded,
    getConnectedUsers,
    getChatRoomMsgs,
    getChatMsg
} = require('./Utils/socket');

// initSentry()

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

serverIO.use((socket, next) => {
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
    socket.on('search-songs', async (data) => {
        await getSearchedSongs(data, socket, serverIO);
    });

    // Welcome Msg
    socket.on('emit-message-welcomeMsg', async (data) => {
        await getWelcomeMsg(data, socket, serverIO);
    });

    //  Song Error
    socket.on('send-song-error', async (data) => {
        await getSongError(data, socket, serverIO);
    });

    // Vote
    socket.on('send-message-vote-up', async (data) => {
        await getSongVote(data, socket, serverIO);
    });

    // Remove song
    socket.on('send-message-remove-song', async (data) => {
        await getSongRemoved(data, socket, serverIO);
    });

    // Add song
    socket.on('send-message-add-song', async (data) => {
        await getSongAdded(data, socket, serverIO);
    });

    socket.on('get-connected-users', async (data) => {
        await getConnectedUsers(data, socket, serverIO);
    });

    socket.on('moodem-chat', async (data) => {
        await getChatRoomMsgs(data, socket, serverIO);
    });

    socket.on('chat-messages', async (data) => {
        await getChatMsg(data, socket, serverIO);
    });

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
