/* eslint-disable max-len */
import axios from 'axios';
import React from 'react';
import io from 'socket.io-client';
import { SC_KEY, YOUTUBE_KEY } from '../../constants/api/apiKeys';
import { IP, socketConf } from '../../Helpers/services/socket';

const DEFAULT_SUFFIX = 'server-send-message-';
const DEFAULT_ACTIONS = ['media', 'vote', 'boost', 'remove', 'chat-messages'];
const serversKeysMap = {
    soundcloud: SC_KEY,
    youtube: YOUTUBE_KEY
};

export class MediaBuilder {
    public apiUrl: any;
    public data: any;
    socket = () => io(IP, socketConf);
    setApi = (apiUrl) => {
        this.apiUrl = apiUrl;
    };
    getApi = () => this.apiUrl;
    playerRef = () => React.createRef();
    msgFromServer = (socket, cb, actions = DEFAULT_ACTIONS) => actions.forEach(action => {
        socket.on(`${DEFAULT_SUFFIX}${action}`, cb);
    });
    msgToServer = (socket, msg, obj) => socket.emit(msg, obj);
    off = (socket) => socket.off();
    getData = async (url, server, token) => {
        try {
            const { data } = await axios.get(`${url}${serversKeysMap[server]}`, {
                cancelToken: token
            });
            return Promise.resolve(data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Error: ', error.message);
            }
            throw error;
        }
    };
    checkIfAlreadyOnList = (medias, searchedMedias) => {
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
}
