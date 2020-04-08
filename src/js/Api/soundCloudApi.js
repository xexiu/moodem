import axios from 'axios';

const SC_KEY = 'b8f06bbb8e4e9e201f9e6e46001c3acb';

export async function getSoundCloudTacks(myCancelToken, query, limit = 50) {
    try {
        const { data } = await axios.get(`https://api.soundcloud.com/tracks/?client_id=${SC_KEY}&limit=${limit}&q=${query}`, {
            cancelToken: myCancelToken,
        })
        return data;
    } catch (error) {
        throw error;
    }
};