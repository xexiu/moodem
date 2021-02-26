export const convertToTimeDuration = (duration: number) => {
    let totalDuration;

    if (String(duration).length < 5) {
        totalDuration = String(duration).substr(0, 1);
    } else if (String(duration).length === 5) {
        totalDuration = String(duration).substr(0, 2);
    } else if (String(duration).length > 5) {
        totalDuration = String(duration).substr(0, 3);
    }

    return Number(totalDuration);
};

export const filterCleanData = (data: any, user: any) => {
    const filteredTracks = [] as any;

    data.forEach((track: any, index: number) => {
        if (track.kind === 'track' && track.streamable) {
            filteredTracks.push({
                index,
                id: track.id,
                artwork_url: track.artwork_url,
                created_at: track.created_at,
                last_modified: track.last_modified,
                title: track.title,
                duration: convertToTimeDuration(track.duration),
                stream_url: track.stream_url,
                genre: track.genre,
                streamable: track.streamable,
                user: {
                    username: (track.user && track.user.username) || 'Anonymous',
                    uid: user.uid
                },
                likes_count: track.likes_count,
                boosts_count: 0,
                votes_count: 0,
                voted_users: [],
                boosted_users: [],
                video_url: track.video_url,
                download_url: track.download_url,
                song: true
            });
        }
    });

    return filteredTracks;
};
