import axios from 'axios';
import { SC_KEY, YOUTUBE_KEY } from '../../constants/Api/apiKeys';

const serversMap = {
    soundcloud: SC_KEY,
    youtube: YOUTUBE_KEY
};

export const checkIfAlreadyOnList = (medias, searchedMedias) => {
    medias.forEach(media => {
        searchedMedias.forEach(searchedMedia => {
            if (media.id === searchedMedia.id) {
                Object.assign(searchedMedia, {
                    isMediaOnList: true
                });
            }
        });
    });
};

export const getData = async (url, server, token) => {
    try {
        const { data } = await axios.get(`${url}${serversMap[server]}`, {
            cancelToken: token,
        });
        return Promise.resolve(data);
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Error: ', error.message);
        }
        throw error;
    }
};
