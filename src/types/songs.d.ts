import { videoDetailsType } from './videoDetails';

export type songType = {
    id?: number,
    user_id: string,
    voted_users?: (string)[],
    votes_count?: number,
    isPlaying?: boolean,
    videoDetails: videoDetailsType,
    url: string
};
