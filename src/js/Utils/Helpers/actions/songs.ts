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

export function setExtraAttrs(audios: any, user: any) {
    const audiosArr = [] as any;

    audios.forEach((track: any, index: number) => {
        Object.assign(track, {
            index,
            boosts_count: 0,
            votes_count: 0,
            voted_users: [],
            boosted_users: [],
            user: {
                uid: user.uid
            }
        });
        audiosArr.push(track);
    });

    return audiosArr;
}
