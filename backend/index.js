const app = require('express')();
const serverHTTP = require('http').Server(app);
const serverIO = require('socket.io')(serverHTTP);
const ytdl = require('ytdl-core');
const NodeCache = require('node-cache');
const Sentry = require('@sentry/node');
const { CaptureConsole } = require('@sentry/integrations');
const ytsr = require('ytsr');
const cliProgress = require('cli-progress');

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const ttl = 60 * 60 * 1; // cache for 1 Hour ttl -> time to live
// const FIVE_HOURS = ttl * 5;
const ONE_DAY = ttl * 24;
const THIRTY_DAYS = ONE_DAY * 30;
const ONE_YEAR = THIRTY_DAYS * 365;
const myCache = new NodeCache();
// const YOUTUBE_ROOT = 'https://www.youtube.com/watch?v=';
// eslint-disable-next-line max-len
const COOKIE = 'CONSENT=YES+ES.en+20150705-15-0; YSC=RVeWb8KzEXc; LOGIN_INFO=AFmmF2swRgIhALFkP9EgTxgWwh8_Dx3Fa2g-WN-K4umS1JQyzndTP5DLAiEAyHfgMQ2jMlNpvltT8LdxKqTle8a4ZSjODYq-svrKlVA:QUQ3MjNmemFvaS1aNkFXVURieUYtMUtWbnR5bFMzRnJfa21CUXdhSTV4QXNPVnNfQWlabDBUZU1qaC1oMnh1eVNwa2pxVWxkN3duYWdhbkk5aHM1ai1JNHFORy1ZVHNvMWw3X2RBdlhKMGZaamFaa3JfeUZzVmhqTnFLS1BETlJTOFRfTmZ6TVQyd0tfUktlcEQ5X1hiNmROcU5hSEt6NC13; VISITOR_INFO1_LIVE=Foji98RNGoc; HSID=AFT92MyweZvASBFc8; SSID=Adqw7Q8srjSE8qVwE; APISID=aS1BdrF_061pvnJi/AK-F-FrDdaxvZ2M9S; SAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; __Secure-3PAPISID=vziALsWDJB_bSEjT/A7-31kdejYhj8pFGi; SID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQvrjB2Ws224CKFU_q-xDu6g.; __Secure-3PSID=7gd1s7_crFykFs0YacN6Na-duIl1hqXuQ1W1GFC3yPn-rdJQyzg_CthnHmIDweLdzl7x6w.; _gcl_au=1.1.1092345076.1615207146; PREF=tz=America.Bogota&f4=4000000&volume=100; SIDCC=AJi4QfHEidaBriNX7zfdqwhYttDNMZaRIs2EiVR8sxQEsgzh5tlYaBOoAUn9tNTUrmuHbD37LA; __Secure-3PSIDCC=AJi4QfHpDx-igRwtg57bWL78ZZK45bEB4srtDgZAfdcKm4cmO1a5l7jiJ0EVDsAKQlM_meAlN60';

// Sentry.init({
//   dsn: 'https://31ed020c1e8c41d0a2ca9739ecd11edb@o265570.ingest.sentry.io/5206914',
//   debug: false,
//   integrations: [
//     new CaptureConsole({
//       levels: ['error']
//     })
//   ],
//   attachStacktrace: true
// });

// const getStream = async (url) => {
//   console.info(`Downloading from ${url} ...`);

//   let allReceived = false;
//   return new Promise((resolve, reject) => {
//     const stream = ytdl(url, {
//       quality: 'highest',
//       filter: (format) => format.container === 'mp4'
//     })
//       .on('progress', (_, totalDownloaded, total) => {
//         if (!allReceived) {
//           progressBar.start(total, 0, {
//             mbTotal: (total / 1024 / 1024).toFixed(2),
//             mbValue: 0
//           });
//           allReceived = true;
//         }
//         progressBar.increment();
//         progressBar.update(totalDownloaded, {
//           mbValue: (totalDownloaded / 1024 / 1024).toFixed(2)
//         });
//       })
//       .on('end', () => {
//         progressBar.stop();
//         console.info('Successfully downloaded the stream!');
//         return resolve(stream);
//       });
//     resolve(stream);
//   });
// };

function makeRandomChars(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()
      * charactersLength));
  }
  return result;
}

async function searchYoutubeForVideoIds(searchedText) {
  const videoIds = [];
  const options = {
    limit: 20
  };
  const searchResults = await ytsr(searchedText, options);
  const videos = searchResults.items.filter((video) => video.id && !video.isLive && !video.isUpcoming);
  videos.map((video) => videoIds.push(video.id));
  return videoIds;
}

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

// function handleServerError(eventType) {
//   const error = MAP_ERRORS[eventType];

//   console.error('Server Error:', error);
// }

// ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'unhandledRejection', 'SIGTERM'].forEach((eventType) => {
//   process.on(eventType, handleServerError);
// });

function cleanTitle(audio) {
  if (audio.title) {
    Object.assign(audio, {
      title: audio.title.replace('(Official Music Video)', '')
        .replace('(Official Video)', '')
    });
    return audio.title;
  }
  return audio.title;
}

function cleanImageParams(audio) {
  if (audio.thumbnail) {
    if (audio.thumbnail.indexOf('hqdefault.jpg') >= 0) {
      Object.assign(audio, {
        thumbnail: audio.thumbnail.replace(/(\?.*)/g, '')
      });
      return audio.thumbnail;
    }
  }
  return audio.thumbnail;
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

  try {
    const audioYT = await ytdl.getInfo(videoId, {
      requestOptions: {
        headers: {
          Cookie: COOKIE,
          'x-youtube-client-version': '2.20191008.04.01',
          'x-youtube-client-name': '1',
          'x-client-data': '',
          'x-youtube-identity-token': 'QUFFLUhqbWtBX080QlRLNkQ3R2E2RXBWZGtXZFVjd1JuZ3w\u003d',
          'Accept-Encoding': 'identity;q=1, *;q=0',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
          referer: `https://${makeRandomChars(6)}.com`
        }
      }
    });
    // const info = await ytdl.getInfo(videoId);
    // const audio = ytdl.filterFormats(info.formats, 'audioandvideo');
    const audioFormats = audioYT.formats.filter((format) => format.hasAudio && format.hasVideo && format.container === 'mp4');
    if (audioFormats && audioFormats.length) {
      const hasHD1080p = audioFormats.filter((audioFormat) => audioFormat.qualityLabel === '1080p');
      const hasHD720p = audioFormats.filter((audioFormat) => audioFormat.qualityLabel === '720p');
      const hasHD480p = audioFormats.filter((audioFormat) => audioFormat.qualityLabel === '480p');
      const has360p = audioFormats.filter((audioFormat) => audioFormat.qualityLabel === '360p');
      const has240p = audioFormats.filter((audioFormat) => audioFormat.qualityLabel === '240p');
      const has144p = audioFormats.filter((audioFormat) => audioFormat.qualityLabel === '144p');

      const audios = (hasHD1080p.length && hasHD1080p)
        || (hasHD720p.length && hasHD720p)
        || (hasHD480p.length && hasHD480p)
        || (has360p.length && has360p)
        || (has240p.length && has240p)
        || (has144p.length && has144p)
        || audioFormats;

      // eslint-disable-next-line no-restricted-syntax
      for (const attr in audios[0]) {
        if (attr !== 'url') {
          delete audios[0][attr];
        }
      }

      Object.assign(audios[0], {
        id: audioYT.videoDetails.videoId,
        title: audioYT.videoDetails.title,
        duration: audioYT.videoDetails.lengthSeconds,
        thumbnail: audioYT.videoDetails.thumbnails ? audioYT.videoDetails.thumbnails[0].url : 'No image',
        hasExpired: false,
        details: audioYT.videoDetails,
        isCachedInServerNode: false
      });

      cleanImageParams(audios[0]);
      cleanTitle(audios[0]);

      myCache.set(key, { ...audios[0] }, ONE_YEAR);
      return { ...audios[0] };
    }

    return {};
  } catch (error) {
    console.error('Error converting getSong', JSON.stringify(error));
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
      songs: [],
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
  // eslint-disable-next-line no-param-reassign
  socket.uid = socket.handshake.query.uid;
  // eslint-disable-next-line no-param-reassign
  socket.displayName = socket.handshake.query.displayName;
  next(null, true);
});

serverIO.on('connection', (socket) => {
  socket.on('app-goes-to-background', () => {
    // do nothing
    console.log('Onlineee');
  });
  socket.on('search-songs', async (data) => {
    const { searchedText } = data;
    const videoIds = await searchYoutubeForVideoIds(searchedText);
    await socket.join(data.chatRoom);
    buildMedia(data);

    /* TO-DO
    - convert stream to blob and save to firebase
    // const stream = await ytdl('vRXZj0DzXIA') await getStream('https://www.youtube.com/watch?v=8SbUC-UaAxE');
    // const chunks = [];

    // // eslint-disable-next-line no-restricted-syntax
    // for await (const chunk of stream) {
    //   chunks.push(chunk);
    //   chunks.push(new Uint8Array(chunk));
    // }

    // const blob = new Blob(chunks, { type: 'video/mp4' });
    */

    if (videoIds) {
      try {
        let songsCoverted = await Promise.allSettled(videoIds.map(async (videoId) => getSong(videoId)));
        songsCoverted.filter((songConverted) => {
          if (songConverted.status !== 'rejected' && Object.keys(songConverted.value).length) {
            songsCoverted.push(songConverted.value);
            return true;
          }
          return false;
        }, songsCoverted = []);

        serverIO.to(socket.id).emit('get-songs', { // send message only to sender-client
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
        welcomeMsg: `Welcome ${socket.displayName} to ${groupName}!`
      });
  });

  //  Song Error
  socket.on('send-song-error', async (data) => {
    const { song } = data;
    await socket.join(data.chatRoom);
    buildMedia(data);

    const audio = await getSong(song.id, true);

    Object.assign(audio, {
      voted_users: song.voted_users,
      hasExpired: false,
      user: song.user,
      isPlaying: song.isPlaying
    });

    if (song.isSearching) {
      serverIO.to(socket.id).emit('song-error-searching', { song: audio });
    } else {
      serverIO.to(socket.id).emit('song-error', { song: audio });
    }
  });

  // Vote
  socket.on('send-message-vote-up', async (data) => {
    const { song } = data;
    await socket.join(data.chatRoom);
    buildMedia(data);

    const { isVotingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-voted', { song, isVotingSong });
  });

  // Remove song
  socket.on('send-message-remove-song', async (data) => {
    const { song } = data;
    await socket.join(data.chatRoom);
    buildMedia(data);

    const { isRemovingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-removed', { song, isRemovingSong });
  });

  // Add song
  socket.on('send-message-add-song', async (data) => {
    const { song } = data;
    await socket.join(data.chatRoom);

    const { isAddingSong = false } = data;
    serverIO.to(data.chatRoom).emit('song-added', { song, isAddingSong });
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
