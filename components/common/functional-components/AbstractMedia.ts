/* eslint-disable max-len */
import axios from 'axios';
import { useContext, useRef } from 'react';
import io from 'socket.io-client';
import { SC_KEY } from '../../../src/js/Utils/constants/api/apiKeys';
import { IP, socketConf } from '../../../src/js/Utils/Helpers/services/socket';
import { AppContext } from '../../User/functional-components/AppContext';

const SOUNDCLOUD_API = 'https://api.soundcloud.com/tracks/';
const clientKeysMap = {
    soundcloud_api: SOUNDCLOUD_API,
    soundcloud_key: `&client_id=${SC_KEY}`
} as any;

function getUserUidAndName(user: any) {
    let guid = Number(Math.random() * 36);

    if (user) {
        return `uid=${user.uid}&displayName=${user.displayName}`;
    }

    return `uid=${Date.now().toString(36) + (guid++ % 36).toString(36) + Math.random().toString(36).slice(2, 4)}&displayName=Guest`;
}
export class AbstractMedia {
    public user: any;
    public group: any;
    public socket: any;
    public playerRef: any;
    public searchRef: any;
    public signal: any;
    public axios: any;
    public flatListRef: any;
    public toastRef: any;

    constructor() {
        const { user, group } = useContext(AppContext);
        this.user = user;
        this.group = group;
        this.socket = io(IP, { ...socketConf, query: getUserUidAndName(user) });
        this.playerRef = useRef();
        this.searchRef = useRef();
        this.flatListRef = useRef();
        this.toastRef = useRef();
        this.signal = axios.CancelToken.source();
        this.axios = axios;
    }

    on(msgToServer: string, cb: Function) {
        return this.socket.on(msgToServer, cb);
    }

    emit(msgToServer: string, data: object) {
        return this.socket.emit(msgToServer, data);
    }

    async getSongData(options = {} as any, server: string, key: string) {
        let url = clientKeysMap[server];

        Object.keys(options).map((k: string) => {
            url += (url.split('?')[1] ? '&' : '?') + `${k}=${options[k]}`;
        });

        try {
            const { data } = await axios.get(`${url}${clientKeysMap[key] || ''}`, {
                cancelToken: this.signal.token
            });
            return Promise.resolve(data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Error: ', error.message);
                Promise.reject(error);
            } else {
                Promise.reject(error);
            }
        }
    }

    checkIfAlreadyOnList = (medias: string[], searchedMedias: string[]) => {
        medias.forEach((media: any) => {
            searchedMedias.forEach((searchedMedia: any) => {
                if (media.id === searchedMedia.id) {
                    Object.assign(searchedMedia, {
                        isMediaOnList: true
                    });
                }
            });
        });
    };

    destroy = () => {
        this.axios.Cancel();
        this.socket.disconnect();
        this.socket.off(this.on);
        this.socket.close();
    };
}
