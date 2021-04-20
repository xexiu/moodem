/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ytdl = require('ytdl-core');
const mcache = require('memory-cache');

// memory-cache docs -> https://github.com/ptarjan/node-cache
// Socket.io do -> https://socket.io/docs/server-api/#socket-id

const COOKIE = 'CONSENT=YES+ES.en+20150705-15-0; YSC=RVeWb8KzEXc; LOGIN_INFO=AFmmF2swRgIhALFkP9EgTxgWwh8_Dx3Fa2g-WN-K4umS1JQyzndTP5DLAiEAyHfgMQ2jMlNpvltT8LdxKqTle8a4ZSjODYq-svrKlVA:QUQ3MjNmemFvaS1aNkFXVURieUYtMUtWbnR5bFMzRnJfa21CUXdhSTV4QXNPVnNfQWlabDBUZU1qaC1oMnh1eVNwa2pxVWxkN3duYWdhbkk5aHM1ai1JNHFORy1ZVHNvMWw3X2RBdlhKMGZaamFaa3JfeUZzVmhqTnFLS1BETlJTOFRfTmZ6TVQyd0tfUktlcEQ5X1hiNmROcU5hSEt6NC13; VISITOR_INFO1_LIVE=Foji98RNGoc; HSID=AFT92MyweZvASBFc8; SSID=Adqw7Q8srjSE8qVwE; APISID=aS1BdrF_061pvnJi/AK-F-FrDdaxvZ2M9S; SAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; __Secure-3PAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; SID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQvrjB2Ws224CKFU_q-xDu6g.; __Secure-3PSID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQyzg_CthnHmIDweLdzl7x6w.; _gcl_au=1.1.1092345076.1615207146; PREF=tz=America.Bogota&f4=4000000&volume=100; SIDCC=AJi4QfHEidaBriNX7zfdqwhYttDNMZaRIs2EiVR8sxQEsgzh5tlYaBOoAUn9tNTUrmuHbD37LA; __Secure-3PSIDCC=AJi4QfHpDx-igRwtg57bWL78ZZK45bEB4srtDgZAfdcKm4cmO1a5l7jiJ0EVDsAKQlM_meAlN60';
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

function cleanTitle(info) {
  if (info && info.videoDetails && info.videoDetails.title) {
    info.videoDetails.title = info.videoDetails.title.replace('(Official Music Video)', '')
      .replace('(Official Video)', '');
    return info.videoDetails.title;
  }
  return info.videoDetails.title;
}

function cleanImageParams(info) {
  if (info && info.videoDetails && info.videoDetails.thumbnails
    && info.videoDetails.thumbnails.length) {
    if (info.videoDetails.thumbnails[0].url.indexOf('hqdefault.jpg') >= 0) {
      info.videoDetails.thumbnails[0].url = info.videoDetails.thumbnails[0].url.replace(/(\?.*)/g, '');
      return info.videoDetails.thumbnails[0].url;
    }
  }
  return info.videoDetails.thumbnails[0].url;
}

async function getSongs(videoId) {
  const key = `__youtube-songs__${videoId}`;

  const audioMem = memCache.get(key);

  if (audioMem && Object.keys(audioMem).length) {
    Object.assign(audioMem, {
      isCachedInMemory: true
    });
    return audioMem;
  }

  const info = await ytdl.getInfo(videoId, {
    requestOptions: {
      headers: {
        Cookie: COOKIE
      }
    }
  });
  // const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
  const audio = info.formats.filter((format) => format.hasAudio && format.hasVideo);

  cleanImageParams(info);
  cleanTitle(info);

  if (audio && audio.length) {
    memCache.put(key, { ...info, ...audio[0] }, 20000); // seconds 1000 -> 1 sec / 20000 seconds -> 5.5 hours
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
      songs: [],
      messages: [],
      uids: new Set([])
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
  }
  if (varA < varB) {
    return 1;
  }

  return 0;
};

function setExtraAttrs(audios, uid) {
  const audiosArr = [];

  audios.forEach((track, index) => {
    Object.assign(track, {
      id: index,
      isPlaying: false,
      isMediaOnList: false,
      boosts_count: 0,
      votes_count: 0,
      voted_users: [],
      boosted_users: [],
      user: {
        uid
      }
    });
    audiosArr.push(track);
  });

  return audiosArr;
}

io.use((socket, next) => {
  socket.uid = socket.handshake.query.uid;
  socket.displayName = socket.handshake.query.displayName;
  next(null, true);
});

io.on('connection', (socket) => {
  // get songs
  socket.on('search-songs-on-youtube', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    let audios = [];
    if (data.videoIds) {
      try {
        audios = await Promise.all(data.videoIds.map(async (videoId) => getSongs(videoId)));
      } catch (error) {
        // send error to sentry or other server
      }
    }

    io.to(data.chatRoom).emit('get-songs-from-youtube', {
      songs: setExtraAttrs(audios, socket.uid)
    });
  });

  // Welcome Msg
  socket.on('emit-message-welcomeMsg', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    io.to(socket.id).emit('get-message-welcomeMsg',
      {
        welcomeMsg: `Bienvenid@ ${socket.displayName} al grupo ${data.chatRoom.replace(/(--.*)/g, '')}.`
      });
  });

  // Media
  socket.on('emit-medias-group', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.song) {
      chatRooms[data.chatRoom].songs.push(data.song);
      chatRooms[data.chatRoom].songs.forEach((song, index) => Object.assign(song, { id: index }));
    }

    const { songs } = chatRooms[data.chatRoom];

    songs.sort(compareValues('votes_count'));

    io.to(data.chatRoom).emit('get-medias-group', { songs });
  });

  // Vote
  socket.on('send-message-vote-up', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const { songs } = chatRooms[data.chatRoom];

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      const userHasVoted = data.song.voted_users.some((id) => id === data.user_id);
      if (song.id === data.song.id && !userHasVoted) {
        data.song.voted_users.push(data.user_id);
        song.voted_users.push(data.user_id);
        song.votes_count = data.count;
        data.song.votes_count = data.count;
        break;
      }
    }
    io.to(data.chatRoom).emit('song-voted', { song: data.song });
  });

  // Remove song
  socket.on('send-message-remove-song', async (data) => {
    await socket.join(data.chatRoom);

    chatRooms[data.chatRoom].songs.splice(data.song.id, 1);
    chatRooms[data.chatRoom].songs.forEach((song, index) => Object.assign(song, { id: index }));
    io.to(data.chatRoom).emit('song-removed', { song: data.song });
  });

  // Add song
  socket.on('send-message-add-song', async (data) => {
    await socket.join(data.chatRoom);

    if (data.song) {
      chatRooms[data.chatRoom].songs.push(data.song);
      chatRooms[data.chatRoom].songs.forEach((song, index) => Object.assign(song, { id: index }));
    }
    const { isAddingSong = false } = data;
    io.to(data.chatRoom).emit('song-added', { song: data.song, isAddingSong });
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

    if (chatRooms[data.chatRoom].messages.length) {
      io.to(data.chatRoom).emit('moodem-chat', chatRooms[data.chatRoom].messages.slice().reverse());
    }
  });

  socket.on('chat-messages', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);
    console.log('SEEND MSG FROM SERVER', data);

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

  socket.on('disconnect', (reason) => {
    console.log('DISCONNNECT SOCKET ID', socket.id, 'With REASON', reason);
    // socket.removeAllListeners();
    delete socket.id;
    delete socket.uid;
  });
});

server.listen(3000, '::', () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
