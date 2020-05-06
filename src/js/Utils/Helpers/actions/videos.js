import axios from 'axios';
import { YOUTUBE_KEY } from '../../constants/Api/apiKeys';

export const getYoutubeVideos = async (myCancelToken, query) => {
    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=40&key=${YOUTUBE_KEY}`, {
            cancelToken: myCancelToken,
        });
        return data;
    } catch (error) {
        throw error;
    }
};

export const filterCleanData = (data, user) => {
    const filteredTracks = [];

    data.forEach((video, index) => {
        if (video.id.kind !== 'youtube#channel') {
            filteredTracks.push({
                index,
                id: video.id.videoId,
                title: video.snippet.title,
                channelId: video.snippet.channelId,
                channelTitle: video.snippet.channelTitle,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails.default,
                user: {
                    uid: user.uid
                },
                likes_count: 0,
                boosts_count: 0,
                votes_count: 0,
                hasVoted: false,
                hasBoosted: false,
                hasLiked: false
            });
        }
    });

    return filteredTracks;
};
