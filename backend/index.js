/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ytdl = require('ytdl-core');
const mcache = require('memory-cache');

const memCache = new mcache.Cache();

const cacheMiddleware = (duration) => (req, res, next) => {
  const key = `__youtube-songs__${req.originalUrl}` || req.url;
  const cacheContent = memCache.get(key);
  if (cacheContent) {
    res.send(cacheContent);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      memCache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  }
};

async function getSongs(videoId) {
  const key = `__youtube-songs__${videoId}`;
  const info = await ytdl.getInfo(videoId);

  const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  const audio = audioFormats.filter((format) => format.codecs.indexOf('mp4a') >= 0);

  if (audio && audio.length) {
    const audioMem = memCache.get(key);
    if (audioMem) {
      Object.assign(audioMem[0], {
        isCachedInMemory: true,
      });
      return { ...info, ...audioMem[0] };
    }
    memCache.put(key, audio, 30 * 1000);
    return { ...info, ...audio[0] };
  }

  return {};
}

app.get('/', cacheMiddleware(30), (req, res) => {
  res.sendfile('index.html');
});

const chatRooms = {};

function buildMedia(data) {
  if (!chatRooms[data.chatRoom]) {
    chatRooms[data.chatRoom] = {};

    Object.assign(chatRooms[data.chatRoom], {
      songs: new Set([]),
      messages: [],
      uids: new Set([]),
    });
  }
}

const compareValues = (key) => (a, b) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
    return 0;
  }

  const varA = (typeof a[key] === 'string')
    ? a[key].toUpperCase() : a[key];
  const varB = (typeof b[key] === 'string')
    ? b[key].toUpperCase() : b[key];

  if (varA > varB) {
    return -1;
  } if (varA < varB) {
    return 1;
  }

  return 0;
};

// Socket.io doc ==> https://socket.io/docs/server-api/#socket-id

io.use((socket, next) => {
  socket.uid = socket.handshake.query.uid;
  socket.displayName = socket.handshake.query.displayName;
  next(null, true);
});

io.on('connection', (socket) => {
  // get songs
  socket.on('get-songs-from-youtube', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    let results;
    if (data.videoIds) {
      results = await Promise.all(data.videoIds.map(async (videoId) => getSongs(videoId)));
    }

    io.to(data.chatRoom).emit('get-songs-from-youtube', {
      audios: results,
    });
  });

  // Welcome Msg
  socket.on('server-send-message-welcomeMsg', async (data) => {
    buildMedia(data);
    socket.emit('server-send-message-welcomeMsg',
      {
        welcomeMsg: `Bienvenid@ ${socket.displayName} al grupo ${data.chatRoom.replace(/(--.*)/g, '')}.`,
      });
    socket.disconnect(true);
  });

  // Media
  socket.on('send-message-media', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.song) {
      chatRooms[data.chatRoom].songs.add(data.song);
    }
    const songs = Array.from(chatRooms[data.chatRoom].songs);
    songs.forEach((song, index) => {
      Object.assign(song, {
        index,
        isPlaying: false,
      });
    });
    songs.sort(compareValues('votes_count'));

    const { isComingFromSearchingSong = false } = data;

    io.to(data.chatRoom).emit('send-message-media', { songs, isComingFromSearchingSong });
  });

  // Vote
  socket.on('send-message-vote-up', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    Array.from(chatRooms[data.chatRoom].songs)
      .forEach((song) => {
        const userHasVoted = song.voted_users.some((id) => id === data.user_id);

        if (song.id === data.song.id && !userHasVoted) {
          song.voted_users.push(data.user_id);
          song.votes_count = data.count;
          const songs = Array.from(chatRooms[data.chatRoom].songs);
          songs.sort(compareValues('votes_count'));
          io.to(data.chatRoom).emit('send-message-media', { songs });
        }
      });
  });

  // Remove
  socket.on('send-message-remove-song', async (data) => {
    await socket.join(data.chatRoom);

    const removeMedia = () => {
      Array.from(chatRooms[data.chatRoom].songs).forEach((song) => {
        if (song.id === data.song.id) {
          chatRooms[data.chatRoom].songs.delete(song);
        }
      });
      const songs = Array.from(chatRooms[data.chatRoom].songs);
      io.to(data.chatRoom).emit('send-message-media', { songs });
    };

    removeMedia();
  });

  socket.on('get-connected-users', async (data) => {
    buildMedia(data);

    if (data.leaveChatRoom) {
      await socket.leave(data.leaveChatRoom);
      chatRooms[data.chatRoom].uids.delete(socket.uid);
      io.to(data.chatRoom).emit('users-connected-to-room', chatRooms[data.chatRoom].uids.size);
    } else {
      await socket.join(data.chatRoom);
      chatRooms[data.chatRoom].uids.add(socket.uid);
      io.to(data.chatRoom).emit('users-connected-to-room', chatRooms[data.chatRoom].uids.size);
    }
  });

  socket.on('moodem-chat', async (data) => {
    await socket.join(data.chatRoom);

    buildMedia(data);

    if (Array.from(chatRooms[data.chatRoom].messages).length) {
      io.to(data.chatRoom).emit('moodem-chat', chatRooms[data.chatRoom].messages.slice().reverse());
    }
  });

  socket.on('chat-messages', (data) => {
    buildMedia(data);

    if (data.msg) {
      chatRooms[data.chatRoom].messages.push(data.msg);
      io.to(data.chatRoom).emit('chat-messages', data.msg);
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
    delete socket.id;
    delete socket.uid;
  });
});

server.listen(3000, () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
