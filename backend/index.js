/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const app = require('express')();
const serverHTTP = require('http').Server(app);
const serverIO = require('socket.io')(serverHTTP);
const ytdl = require('ytdl-core');
const NodeCache = require('node-cache');
const Sentry = require('@sentry/node');
const { CaptureConsole } = require('@sentry/integrations');

Sentry.init({
  dsn: 'https://31ed020c1e8c41d0a2ca9739ecd11edb@o265570.ingest.sentry.io/5206914',
  debug: false,
  integrations: [
    new CaptureConsole({
      levels: ['error']
    })
  ],
  attachStacktrace: true
});

const MAP_ERRORS = {
  SIGUSR1: 'server kill PID or nodemon restart.',
  SIGUSR2: 'server kill PID or nodemon restart.',
  SIGINT: 'CTRL + C was clicked and stopped the server.',
  uncaughtException: 'Unexpected Error Exception on Server.',
  unhandledRejection: 'Unhandled Promise on Server.',
  exit: 'Server was disconnected.'
};

// memory-cache docs -> https://github.com/ptarjan/node-cache
// Socket.io do -> https://socket.io/docs/server-api/#socket-id

function handleServerError(eventType) {
  const error = MAP_ERRORS[eventType];

  console.error('Server Error:', error);
}

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'unhandledRejection', 'SIGTERM'].forEach((eventType) => {
  process.on(eventType, handleServerError);
});

const ttl = 60 * 60 * 1; // cache for 1 Hour ttl -> time to live
const FIVE_HOURS = ttl * 5;
const ONE_DAY = ttl * 24;
const THIRTY_DAYS = ONE_DAY * 30;
const ONE_YEAR = THIRTY_DAYS * 365;
const COOKIE = 'CONSENT=YES+ES.en+20150705-15-0; YSC=RVeWb8KzEXc; LOGIN_INFO=AFmmF2swRgIhALFkP9EgTxgWwh8_Dx3Fa2g-WN-K4umS1JQyzndTP5DLAiEAyHfgMQ2jMlNpvltT8LdxKqTle8a4ZSjODYq-svrKlVA:QUQ3MjNmemFvaS1aNkFXVURieUYtMUtWbnR5bFMzRnJfa21CUXdhSTV4QXNPVnNfQWlabDBUZU1qaC1oMnh1eVNwa2pxVWxkN3duYWdhbkk5aHM1ai1JNHFORy1ZVHNvMWw3X2RBdlhKMGZaamFaa3JfeUZzVmhqTnFLS1BETlJTOFRfTmZ6TVQyd0tfUktlcEQ5X1hiNmROcU5hSEt6NC13; VISITOR_INFO1_LIVE=Foji98RNGoc; HSID=AFT92MyweZvASBFc8; SSID=Adqw7Q8srjSE8qVwE; APISID=aS1BdrF_061pvnJi/AK-F-FrDdaxvZ2M9S; SAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; __Secure-3PAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; SID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQvrjB2Ws224CKFU_q-xDu6g.; __Secure-3PSID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQyzg_CthnHmIDweLdzl7x6w.; _gcl_au=1.1.1092345076.1615207146; PREF=tz=America.Bogota&f4=4000000&volume=100; SIDCC=AJi4QfHEidaBriNX7zfdqwhYttDNMZaRIs2EiVR8sxQEsgzh5tlYaBOoAUn9tNTUrmuHbD37LA; __Secure-3PSIDCC=AJi4QfHpDx-igRwtg57bWL78ZZK45bEB4srtDgZAfdcKm4cmO1a5l7jiJ0EVDsAKQlM_meAlN60';
const myCache = new NodeCache();

function cleanTitle(audio) {
  if (audio.details && audio.details.title) {
    audio.details.title = audio.details.title.replace('(Official Music Video)', '')
      .replace('(Official Video)', '');
    return audio.details.title;
  }
  return audio.details.title;
}

function cleanImageParams(audio) {
  if (audio.details && audio.details.thumbnails) {
    if (audio.details.thumbnails[0].url.indexOf('hqdefault.jpg') >= 0) {
      audio.details.thumbnails[0].url = audio.details.thumbnails[0].url.replace(/(\?.*)/g, '');
      return audio.details.thumbnails[0].url;
    }
  }
  return audio.details.thumbnails[0].url;
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
        Cookie: COOKIE,
        'x-youtube-client-version': '2.20191008.04.01',
        'x-youtube-client-name': '1',
        'x-client-data': '',
        'x-youtube-identity-token': 'QUFFLUhqbWtBX080QlRLNkQ3R2E2RXBWZGtXZFVjd1JuZ3w\u003d',
        Accept: 'application/json, text/plain, */*'
      }
    }
  });
  // const audio = ytdl.filterFormats(info.formats, 'audioandvideo');
  const audio = info.formats.filter((format) => format.hasAudio && format.hasVideo);

  if (audio && audio.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const attr in audio[0]) {
      if (attr !== 'url') {
        delete audio[0][attr];
      }
    }

    Object.assign(audio[0], {
      id: info.videoDetails.videoId,
      hasExpired: false,
      details: info.videoDetails,
      isCachedInServerNode: false
    });

    cleanImageParams(audio[0]);
    cleanTitle(audio[0]);

    myCache.set(key, { ...audio[0] }, FIVE_HOURS);
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
      messages: [],
      uids: new Set([])
    });
  }
}

function setExtraAttrs(audios, uid, isSearching = false) {
  const audiosArr = [];

  audios.forEach((track) => {
    Object.assign(track, {
      id: track.id,
      details: track.details,
      isSearching,
      isPlaying: false,
      isMediaOnList: false,
      boosts_count: 0,
      voted_users: [],
      boosted_users: [],
      hasExpired: false,
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
  socket.on('search-songs-on-youtube', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    if (data.videoIds) {
      try {
        let songsCoverted = await Promise.allSettled(data.videoIds.map(async (videoId) => getSong(videoId)));
        songsCoverted.filter((songConverted) => songConverted.status !== 'rejected' && songsCoverted.push(songConverted.value), songsCoverted = []);

        serverIO.to(socket.id).emit('get-songs-from-youtube', { // send message only to sender-client
          songs: [...setExtraAttrs(songsCoverted, socket.uid, true)]
        });
      } catch (error) {
        console.error('Error converting allSongs on search-songs-on-youtube', JSON.stringify(error));
      }
    }
  });

  // Welcome Msg
  socket.on('emit-message-welcomeMsg', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const groupName = data.chatRoom.replace(/(.*?_GroupName_)/g, '');
    serverIO.to(socket.id).emit('get-message-welcomeMsg',
      {
        welcomeMsg: `Bienvenid@ ${socket.displayName} al grupo ${groupName}!`
      });
  });

  //  Song Error
  socket.once('send-song-error', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const audio = await getSong(data.song.id, true);

    Object.assign(data.song, {
      hasExpired: false,
      url: audio.url
    });

    if (data.song.isSearching) {
      serverIO.to(socket.id).emit('song-error-searching', { song: data.song });
    } else {
      serverIO.to(socket.id).emit('song-error', { song: data.song });
    }
  });

  // Vote
  socket.on('send-message-vote-up', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const userHasVoted = data.song.voted_users.some((id) => id === data.user_id);

    if (!userHasVoted) {
      if (data.song.voted_users.indexOf(data.user_uid) === -1) {
        data.song.voted_users.push(data.user_id);
      }
    }

    const { isVotingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-voted', { song: data.song, isVotingSong });
  });

  // Remove song
  socket.on('send-message-remove-song', async (data) => {
    await socket.join(data.chatRoom);
    buildMedia(data);

    const { isRemovingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-removed', { song: data.song, isRemovingSong });
  });

  // Add song
  socket.on('send-message-add-song', async (data) => {
    await socket.join(data.chatRoom);

    const { isAddingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-added', { song: data.song, isAddingSong });
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
