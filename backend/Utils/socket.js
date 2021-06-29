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

class MySocket {
    constructor(socket, serverIO) {
        this.socket = socket;
        this.serverIO = serverIO;
        this.handleGetWelcomeMsg = this.getWelcomeMsg.bind(this);
        this.handleGetSearchedSongs = this.getSearchedSongs.bind(this);
        this.handleGetSongError = this.getSongError.bind(this);
        this.handleGetSongVote = this.getSongVote.bind(this);
        this.handleGetSongRemoved = this.getSongRemoved.bind(this);
        this.handleGetSongAdded = this.getSongAdded.bind(this);
        this.handleGetConnectedUsers = this.getConnectedUsers.bind(this);
        this.handleGetChatRoomMsgs = this.getChatRoomMsgs.bind(this);
        this.handleGetChatMsg = this.getChatMsg.bind(this);
        this.handleJoinChatRooms = this.joinChatRooms.bind(this);
        this.handleLeaveChatRooms = this.leaveChatRooms.bind(this);
        this.hanldeGetUseIsTyping = this.getUseIsTyping.bind(this);
    }

    async getWelcomeMsg({ chatRoom }) {
        try {
            await this.socket.join(chatRoom);
            buildMedia(chatRoom);

            const groupName = chatRoom.replace(/(.*?_GroupName_)/g, '');
            this.serverIO.to(this.socket.id).emit('get-message-welcomeMsg',
                {
                    welcomeMsg: `Welcome ${this.socket.displayName} to ${groupName}!`
                });
        } catch (error) {
            console.error('Error getWelcomeMsg', error);
        }
    }

    async getSearchedSongs({ chatRoom, searchedText }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        try {
            const videoIds = await searchYoutubeForVideoIds(searchedText);
            const songs = await getAllSongs(videoIds);
            this.serverIO.to(this.socket.id).emit('get-songs', { // send message only to sender-client
                songs: [...setExtraAttrs(songs, this.socket.uid, true)]
            });
        } catch (error) {
            console.error('Error converting allSongs on search-songs-on-youtube', error);
        }
    }

    async getSongError({ song, chatRoom }) {
        await this.socket.join(chatRoom);
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
                this.serverIO.to(this.socket.id).emit('song-error-searching', { song: audio });
            } else {
                this.serverIO.to(this.socket.id).emit('song-error', { song: audio });
            }
        } catch (error) {
            console.error('Error getSongError', error);
        }
    }

    async getSongVote({ song, chatRoom, isVotingSong = false }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        this.serverIO.to(chatRoom).emit('song-voted', { song, isVotingSong });
    }

    async getSongRemoved({ song, chatRoom, isRemovingSong = false }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        this.serverIO.to(chatRoom).emit('song-removed', { song, isRemovingSong });
    }

    async getSongAdded({ song, chatRoom, isAddingSong = false }) {
        await this.socket.join(chatRoom);
        this.serverIO.to(chatRoom).emit('song-added', { song, isAddingSong });
    }

    async getConnectedUsers({ chatRoom, leaveChatRoom }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        if (leaveChatRoom) {
            await this.socket.leave(leaveChatRoom);
            chatRooms[chatRoom].uids.delete(this.socket.uid);
            this.serverIO.to(chatRoom).emit('users-connected-to-room', chatRooms[chatRoom].uids.size);
        } else {
            await this.socket.join(chatRoom);
            chatRooms[chatRoom].uids.add(this.socket.uid);
            this.serverIO.to(chatRoom).emit('users-connected-to-room', chatRooms[chatRoom].uids.size);
        }
    }

    async getChatRoomMsgs({ chatRoom }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        if (chatRooms[chatRoom].messages.length) {
            this.serverIO.to(chatRoom).emit('moodem-chat', chatRooms[chatRoom].messages.slice().reverse());
        } else {
            this.serverIO.to(chatRoom).emit('moodem-chat', []);
        }
    }

    async getChatMsg({ chatRoom, msg }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        if (msg) {
            chatRooms[chatRoom].messages.push(msg);
            this.serverIO.to(chatRoom).emit('chat-messages', msg);
        }
    }

    async joinChatRooms(data) {
        await this.socket.join(['room 237', 'room 238']);

        const rooms = Object.keys(this.socket.rooms);
        console.log(rooms); // [ <socket.id>, 'room 237', 'room 238' ]
        this.serverIO.to('room 237').to('room 238').emit('a new user has joined the room'); // broadcast to everyone in both rooms
    }

    async leaveChatRooms(data) {
        await this.socket.leave('room 237');
        this.serverIO.to('room 237').emit(`user ${this.socket.id} has left the room`);
    }

    async getUseIsTyping({ chatRoom, isTyping }) {
        await this.socket.join(chatRoom);
        buildMedia(chatRoom);

        this.socket.broadcast.to(chatRoom).emit('user-typing', { isTyping }); // send to all sockets in room/channel except sender
    }
}

module.exports = {
    MySocket
};
