/* eslint-disable no-param-reassign */
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
    } else if (varA < varB) {
        return 1;
    }

    return 0;
};

const voteMedia = (mediaList, data, io, media) => {
    mediaList.forEach(song => {
        if (song.id === data[media].id) {
            song.voted_users.push(data.user_id);
            song.votes_count = data.count;
        }
    });

    mediaList.sort(compareValues('votes_count'));
    io.to(data.chatRoom).emit('server-send-message-vote', mediaList);
};

const boostMedia = (mediaList, data, io, media) => {
    mediaList.forEach(song => {
        if (song.id === data[media].id) {
            song.boosted_users.push(data.user_id);
            song.boosts_count = data.count;
        }
    });

    mediaList.sort(compareValues('boosts_count'));
    io.to(data.chatRoom).emit('server-send-message-boost', mediaList);
};

const removeMedia = (mediaList, data, io, media) => {
    mediaList.forEach((song, index) => {
        if (song.id === data[media].id) {
            mediaList.splice(index, 1);
        }
    });
    io.to(data.chatRoom).emit('server-send-message-remove', mediaList);
};

module.exports = {
    compareValues,
    voteMedia,
    boostMedia,
    removeMedia
};
