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
                voted_users: [],
                boosted_users: [],
                video: true
            });
        }
    });

    return filteredTracks;
};
