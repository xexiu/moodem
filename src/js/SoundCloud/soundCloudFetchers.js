import axios from 'axios';
import { SC_KEY } from '../Utils/constants/Api/apiKeys';

export const getSoundCloudTracks = async (myCancelToken, query, limit = 50) => {
    try {
        const { data } = await axios.get(`https://api.soundcloud.com/tracks/?client_id=${SC_KEY}&limit=${limit}&q=${query}`, {
            cancelToken: myCancelToken,
        });
        return data;
    } catch (error) {
        throw error;
    }
};

export const getSoundCloudData = async (query, signal) => {
    try {
        const data = await getSoundCloudTracks(signal.token, query);
        return Promise.resolve(data);
    } catch (err) {
        if (axios.isCancel(err)) {
            console.log('Error: ', err.message);
        }
    }
};
