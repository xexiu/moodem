/* eslint-disable max-len */
import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { SC_KEY, YOUTUBE_KEY } from '../../constants/Api/apiKeys';
import { IP, socketConf } from '../../Helpers/services/socket';

const DEFAULT_SUFFIX = 'server-send-message-';
const DEFAULT_ACTIONS = ['media', 'vote', 'boost', 'remove'];
const serversKeysMap = {
    soundcloud: SC_KEY,
    youtube: YOUTUBE_KEY
};

export class MediaBuilder {
    socket = () => io(IP, socketConf)
    setApi = (apiUrl) => {
        this.apiUrl = apiUrl;
    }
    getApi = () => this.apiUrl
    playerRef = () => React.createRef()
    msgFromServer = (socket, cb, actions = DEFAULT_ACTIONS) => actions.forEach(action => {
        socket.on(`${DEFAULT_SUFFIX}${action}`, cb);
    })
    msgToServer = (socket, action, obj) => socket.emit(action, obj)
    off = (socket) => socket.off();
}

export const checkIfAlreadyOnList = (medias, searchedMedias) => {
    medias.forEach(_media => {
        searchedMedias.forEach(searchedMedia => {
            if (_media.id === searchedMedia.id) {
                Object.assign(searchedMedia, {
                    isMediaOnList: true
                });
            }
        });
    });
};

export const getData = async (url, server, token) => {
    try {
        const { data } = await axios.get(`${url}${serversKeysMap[server]}`, {
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
