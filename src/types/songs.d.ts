import { details } from './details';

export type songType = {
    id?: number,
    user_id: string,
    voted_users?: (string)[],
    isPlaying?: boolean,
    details: details,
    url: string
};
