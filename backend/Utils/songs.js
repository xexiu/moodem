const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const { options } = require('./ytdlConfig');
const { getKey, setKey } = require('./cache');
const { ONE_YEAR } = require('./constants');

async function searchYoutubeForVideoIds(searchedText) {
    const videoIds = [];

    try {
        const searchResults = await ytsr(searchedText, {
            limit: 20
        });
        const videos = searchResults.items.filter((video) => video.id && !video.isLive && !video.isUpcoming);
        videos.map((video) => videoIds.push(video.id));
        return videoIds;
    } catch (error) {
        console.error('Error converting getSong', error);
    }
    return videoIds;
}

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

async function getSong(videoId) {
    try {
        // await getStreamBuffers(videoId);
        const audioYT = await ytdl.getInfo(videoId, options);
        const audioFormats = audioYT.formats.filter((format) => format.hasAudio && format.hasVideo && format.container === 'mp4');
        if (audioFormats && audioFormats.length) {
            const audio = ytdl.chooseFormat(audioFormats, {
                quality: 'highestvideo'
            });
            Object.keys(audio).forEach((attr) => attr !== 'url' && delete audio[attr]);
            Object.assign(audio, {
                id: audioYT.videoDetails.videoId,
                title: audioYT.videoDetails.title,
                duration: audioYT.videoDetails.lengthSeconds,
                thumbnail: audioYT.videoDetails.thumbnails ? audioYT.videoDetails.thumbnails[0].url : 'No image',
                hasExpired: false,
                details: audioYT.videoDetails,
                isCachedInServerNode: false
            });
            return { ...audio };
        }

        return {};
    } catch (error) {
        console.error('Error converting getSong', error);
    }

    return {};
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

async function getSongsOrCache(videoIds) {
    try {
        return await Promise.allSettled(videoIds.map(async (videoId) => {
            if (getKey(`__youtube-songs__${videoId}`)) {
                const audio = getKey(`__youtube-songs__${videoId}`);
                return audio;
            }
            const audio = await getSong(videoId);
            cleanImageParams(audio);
            cleanTitle(audio);
            setKey(`__youtube-songs__${videoId}`, { ...audio }, ONE_YEAR);

            return audio;
        }));
    } catch (error) {
        console.error('Error getSongsOrCache', error);
    }
    return {};
}

function checkIfValid(song, songConverted) {
    if (song.status !== 'rejected' && Object.keys(song.value).length) {
        songConverted.push(song.value);
        return true;
    }
    return false;
}

async function getAllSongs(videoIds) {
    const songsCoverted = [];
    try {
        const songs = await getSongsOrCache(videoIds);

        songs.filter((song) => checkIfValid(song, songsCoverted), songsCoverted);

        return songsCoverted;
    } catch (error) {
        console.error('Error getAllSongs', error);
    }
    return songsCoverted;
}

module.exports = {
    searchYoutubeForVideoIds,
    cleanTitle,
    cleanImageParams,
    getSong,
    setExtraAttrs,
    getAllSongs
};
