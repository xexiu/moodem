import axios from 'axios';
import { SC_KEY } from '../Utils/constants/Api/apiKeys';

export async function getSoundCloudTacks(myCancelToken, query, limit = 50) {
    try {
        const { data } = await axios.get(`https://api.soundcloud.com/tracks/?client_id=${SC_KEY}&limit=${limit}&q=${query}`, {
            cancelToken: myCancelToken,
        });
        return data;
    } catch (error) {
        throw error;
    }
};