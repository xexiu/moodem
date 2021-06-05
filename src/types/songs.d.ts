import { details } from './details';

export type songType = {
    id?: number,
    user_id: string,
    voted_users?: (string)[],
    votes_count?: number,
    isPlaying?: boolean,
    details: details,
    url: string
};
