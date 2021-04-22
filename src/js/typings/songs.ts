import { videoDetailsType } from './videoDetails';

export type songType = {
    id?: number,
    voted_users?: (string)[],
    votes_count?: number,
    isPlaying?: boolean,
    videoDetails: videoDetailsType
};
