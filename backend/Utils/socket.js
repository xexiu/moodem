const {
    searchYoutubeForVideoIds,
    getAllSongs,
    setExtraAttrs,
    getSong
} = require('./songs');

const chatRooms = {};

function buildMedia(chatRoom) {
    if (!chatRooms[chatRoom]) {
        chatRooms[chatRoom] = {};

        Object.assign(chatRooms[chatRoom], {
            songs: [],
            messages: [],
            uids: new Set([])
        });
    }
}

async function getSearchedSongs({ chatRoom, searchedText }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    try {
        const videoIds = await searchYoutubeForVideoIds(searchedText);
        const songs = await getAllSongs(videoIds);
        serverIO.to(socket.id).emit('get-songs', { // send message only to sender-client
            songs: [...setExtraAttrs(songs, socket.uid, true)]
        });
    } catch (error) {
        console.error('Error converting allSongs on search-songs-on-youtube', error);
    }
}

async function getWelcomeMsg({ chatRoom }, socket, serverIO) {
    try {
        await socket.join(chatRoom);
        buildMedia(chatRoom);

        const groupName = chatRoom.replace(/(.*?_GroupName_)/g, '');
        serverIO.to(socket.id).emit('get-message-welcomeMsg',
            {
                welcomeMsg: `Welcome ${socket.displayName} to ${groupName}!`
            });
    } catch (error) {
        console.error('Error getWelcomeMsg', error);
    }
}

async function getSongError({ song, chatRoom }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    try {
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
    } catch (error) {
        console.error('Error getSongError', error);
    }
}

async function getSongVote({ song, chatRoom, isVotingSong = false }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    serverIO.to(chatRoom).emit('song-voted', { song, isVotingSong });
}

async function getSongRemoved({ song, chatRoom, isRemovingSong = false }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    serverIO.to(chatRoom).emit('song-removed', { song, isRemovingSong });
}

async function getSongAdded({ song, chatRoom, isAddingSong = false }, socket, serverIO) {
    await socket.join(chatRoom);
    serverIO.to(chatRoom).emit('song-added', { song, isAddingSong });
}

async function getConnectedUsers({ chatRoom, leaveChatRoom }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    if (leaveChatRoom) {
        await socket.leave(leaveChatRoom);
        chatRooms[chatRoom].uids.delete(socket.uid);
        serverIO.to(chatRoom).emit('users-connected-to-room', chatRooms[chatRoom].uids.size);
    } else {
        await socket.join(chatRoom);
        chatRooms[chatRoom].uids.add(socket.uid);
        serverIO.to(chatRoom).emit('users-connected-to-room', chatRooms[chatRoom].uids.size);
    }
}

async function getChatRoomMsgs({ chatRoom }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    if (chatRooms[chatRoom].messages.length) {
        serverIO.to(chatRoom).emit('moodem-chat', chatRooms[chatRoom].messages.slice().reverse());
    } else {
        serverIO.to(chatRoom).emit('moodem-chat', []);
    }
}

async function getChatMsg({ chatRoom, msg }, socket, serverIO) {
    await socket.join(chatRoom);
    buildMedia(chatRoom);

    if (msg) {
        chatRooms[chatRoom].messages.push(msg);
        serverIO.to(chatRoom).emit('chat-messages', msg);
    }
}

async function joinChatRooms(data, socket, serverIO) {
    await socket.join(['room 237', 'room 238']);

    const rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237', 'room 238' ]
    serverIO.to('room 237').to('room 238').emit('a new user has joined the room'); // broadcast to everyone in both rooms
}

async function leaveChatRooms(data, socket, serverIO) {
    await socket.leave('room 237');
    serverIO.to('room 237').emit(`user ${socket.id} has left the room`);
}

module.exports = {
    getSearchedSongs,
    getWelcomeMsg,
    getSongError,
    getSongVote,
    getSongRemoved,
    getSongAdded,
    getConnectedUsers,
    getChatRoomMsgs,
    getChatMsg,
    joinChatRooms,
    leaveChatRooms
};
