/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const app = require('express')();
const serverHTTP = require('http').Server(app);
const serverIO = require('socket.io')(serverHTTP);
const ytdl = require('ytdl-core');
const NodeCache = require('node-cache');

// memory-cache docs -> https://github.com/ptarjan/node-cache
// Socket.io do -> https://socket.io/docs/server-api/#socket-id

const ttl = 60 * 60 * 1; // cache for 1 Hour ttl -> time to live
const ONE_DAY = ttl * 24;
const THIRTY_DAYS = ONE_DAY * 30;
const ONE_YEAR = THIRTY_DAYS * 365;
const COOKIE = 'CONSENT=YES+ES.en+20150705-15-0; YSC=RVeWb8KzEXc; LOGIN_INFO=AFmmF2swRgIhALFkP9EgTxgWwh8_Dx3Fa2g-WN-K4umS1JQyzndTP5DLAiEAyHfgMQ2jMlNpvltT8LdxKqTle8a4ZSjODYq-svrKlVA:QUQ3MjNmemFvaS1aNkFXVURieUYtMUtWbnR5bFMzRnJfa21CUXdhSTV4QXNPVnNfQWlabDBUZU1qaC1oMnh1eVNwa2pxVWxkN3duYWdhbkk5aHM1ai1JNHFORy1ZVHNvMWw3X2RBdlhKMGZaamFaa3JfeUZzVmhqTnFLS1BETlJTOFRfTmZ6TVQyd0tfUktlcEQ5X1hiNmROcU5hSEt6NC13; VISITOR_INFO1_LIVE=Foji98RNGoc; HSID=AFT92MyweZvASBFc8; SSID=Adqw7Q8srjSE8qVwE; APISID=aS1BdrF_061pvnJi/AK-F-FrDdaxvZ2M9S; SAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; __Secure-3PAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; SID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQvrjB2Ws224CKFU_q-xDu6g.; __Secure-3PSID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQyzg_CthnHmIDweLdzl7x6w.; _gcl_au=1.1.1092345076.1615207146; PREF=tz=America.Bogota&f4=4000000&volume=100; SIDCC=AJi4QfHEidaBriNX7zfdqwhYttDNMZaRIs2EiVR8sxQEsgzh5tlYaBOoAUn9tNTUrmuHbD37LA; __Secure-3PSIDCC=AJi4QfHpDx-igRwtg57bWL78ZZK45bEB4srtDgZAfdcKm4cmO1a5l7jiJ0EVDsAKQlM_meAlN60';
const myCache = new NodeCache();

function cleanTitle(info) {
  if (info && info.videoDetails && info.videoDetails.title) {
    info.videoDetails.title = info.videoDetails.title.replace('(Official Music Video)', '')
      .replace('(Official Video)', '');
    return info.videoDetails.title;
  }
  return info.videoDetails.title;
}

function cleanImageParams(info) {
  if (info.videoDetails && info.videoDetails.thumbnails) {
    if (info.videoDetails.thumbnails[0].url.indexOf('hqdefault.jpg') >= 0) {
      info.videoDetails.thumbnails[0].url = info.videoDetails.thumbnails[0].url.replace(/(\?.*)/g, '');
      return info.videoDetails.thumbnails[0].url;
    }
  }
  return info.videoDetails.thumbnails[0].url;
}

async function getSong(videoId, hasExpired = false) {
  const key = `__youtube-songs__${videoId}`;

  const audioMem = myCache.get(key);

  if (hasExpired) {
    myCache.take(key); // take and delete --> https://github.com/node-cache/node-cache#take-a-key-take
  }

  if (audioMem && Object.keys(audioMem).length && !hasExpired) {
    Object.assign(audioMem, {
      isCachedInServerNode: true
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

  if (audio && audio.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const attr in audio[0]) {
      if (attr !== 'url') {
        delete audio[0][attr];
      }
    }

    Object.assign(audio[0], {
      videoDetails: info.videoDetails,
      isCachedInServerNode: false
    });

    cleanImageParams(audio[0]);
    cleanTitle(audio[0]);

    myCache.set(key, { ...audio[0] }, ONE_YEAR);
    return { ...audio[0] };
  }

  return {};
}

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

const chatRooms = {};

function buildMedia(data) {
  if (!chatRooms[data.chatRoom]) {
    chatRooms[data.chatRoom] = {};

    Object.assign(chatRooms[data.chatRoom], {
      songs: [...new Set([])],
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

function setExtraAttrs(audios, uid, isSearching = false) {
  const audiosArr = [];

  audios.forEach((track, index) => {
    Object.assign(track, {
      id: index,
      isSearching,
      isPlaying: false,
      isVotingSong: false,
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

serverIO.use((socket, next) => {
  socket.uid = socket.handshake.query.uid;
  socket.displayName = socket.handshake.query.displayName;
  next(null, true);
});

serverIO.on('connection', (socket) => {
  // get songs
  socket.on('search-songs-on-youtube', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.videoIds) {
      try {
        const songsCoverted = await Promise.all(data.videoIds.map(async (videoId) => getSong(videoId)));

        serverIO.to(socket.id).emit('get-songs-from-youtube', { // send message only to sender-client
          songs: [...setExtraAttrs(songsCoverted, socket.uid, true)]
        });
      } catch (error) {
        // send error to sentry or other server
      }
    }
  });

  // Welcome Msg
  socket.on('emit-message-welcomeMsg', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    serverIO.to(socket.id).emit('get-message-welcomeMsg',
      {
        welcomeMsg: `Bienvenid@ ${socket.displayName} al grupo ${data.chatRoom.replace(/(--.*)/g, '')}.`
      });
  });

  // Set Medias on landing

  socket.on('emit-set-medias', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.songs) {
      chatRooms[data.chatRoom].songs = [...new Set([])];
      chatRooms[data.chatRoom].songs = data.songs;
      const { songs } = chatRooms[data.chatRoom];
      songs.sort(compareValues('votes_count'));
      songs.forEach((song, index) => Object.assign(song, { id: index }));
    }
  });

  //  Song Error
  socket.on('send-song-error', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const audio = await getSong(data.song.videoDetails.videoId, true);
    const { songs } = chatRooms[data.chatRoom];

    Object.assign(data.song, {
      url: audio.url
    });

    serverIO.to(socket.id).emit('song-error', { song: data.song });

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];

      if (song.videoDetails.videoId === data.song.videoDetails.videoId) {
        Object.assign(song, {
          url: audio.url
        });
        break;
      }
    }
  });

  //  Song Error When Searching
  socket.on('send-song-error-searching', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const audio = await getSong(data.song.videoDetails.videoId, true);

    Object.assign(data.song, {
      url: audio.url
    });

    serverIO.to(socket.id).emit('song-error-searching', { song: data.song });
  });

  // Vote
  socket.on('send-message-vote-up', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const { songs } = chatRooms[data.chatRoom];

    const song = songs[data.song.id];

    const userHasVoted = data.song.voted_users.some((id) => id === data.user_id);

    if (song.id === data.song.id && !userHasVoted) {
      song.voted_users.push(data.user_id);
      song.votes_count = data.count;

      data.song.voted_users.push(data.user_id);
      data.song.votes_count = data.count;
    }

    songs.sort(compareValues('votes_count'));
    songs.forEach((_song, index) => Object.assign(_song, { id: index }));

    const { isVotingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-voted', { song: data.song, isVotingSong });
  });

  // Remove song
  socket.on('send-message-remove-song', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const { songs } = chatRooms[data.chatRoom];

    songs.splice(data.song.id, 1);
    songs.forEach((_song, index) => Object.assign(_song, { id: index }));
    const { isRemovingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-removed', { song: data.song, isRemovingSong });
  });

  // Add song
  socket.on('send-message-add-song', async (data) => {
    await socket.join(data.chatRoom);
    let duplicatedSong = false;

    const { songs } = chatRooms[data.chatRoom];

    if (data.song) {
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        if (song.videoDetails.videoId === data.song.videoDetails.videoId) {
          duplicatedSong = true;
          break;
        }
      }
    }
    if (!duplicatedSong) {
      data.song.id = songs.length;
      songs.push(data.song);

      const { isAddingSong = false } = data;
      serverIO.to(data.chatRoom).emit('song-added', { song: data.song, isAddingSong });
    }
  });

  socket.on('get-connected-users', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.leaveChatRoom) {
      await socket.leave(data.leaveChatRoom);
      chatRooms[data.chatRoom].uids.delete(socket.uid);
      serverIO.to(data.chatRoom).emit('users-connected-to-room', chatRooms[data.chatRoom].uids.size);
    } else {
      await socket.join(data.chatRoom);
      chatRooms[data.chatRoom].uids.add(socket.uid);
      serverIO.to(data.chatRoom).emit('users-connected-to-room', chatRooms[data.chatRoom].uids.size);
    }
  });

  socket.on('moodem-chat', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (chatRooms[data.chatRoom].messages.length) {
      serverIO.to(data.chatRoom).emit('moodem-chat', chatRooms[data.chatRoom].messages.slice().reverse());
    } else {
      serverIO.to(data.chatRoom).emit('moodem-chat', []);
    }
  });

  socket.on('chat-messages', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.msg) {
      chatRooms[data.chatRoom].messages.push(data.msg);
      serverIO.to(data.chatRoom).emit('chat-messages', data.msg);
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
    socket.offAny();
    delete socket.id;
    delete socket.uid;
    delete socket.displayName;
  });
});

serverHTTP.listen(3000, '::', () => { // Digital Ocean Open Port
  console.log('listening on *:3000');
});
