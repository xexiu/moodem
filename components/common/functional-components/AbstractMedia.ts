/* eslint-disable max-len */
import axios from 'axios';
import { useContext, useRef } from 'react';
import io from 'socket.io-client';
import { SC_KEYS } from '../../../src/js/Utils/constants/api/apiKeys';
import { IP, socketConf } from '../../../src/js/Utils/Helpers/services/socket';
import { AppContext } from '../../User/functional-components/AppContext';

const LIMIT_RESULT_SEARCHED_SONGS = 20;
const SOUNDCLOUD_API = 'https://api.soundcloud.com/tracks/';
const clientKeysMap = {
    soundcloud_api: SOUNDCLOUD_API,
    soundcloud_key: '&client_id='
} as any;

const DEFAULT_SEARCH_OPTIONS = {
    limit: LIMIT_RESULT_SEARCHED_SONGS
};

function getUserUidAndName(user: any) {
    let guid = Number(Math.random() * 36);

    if (user) {
        return `uid=${user.uid}&displayName=${user.displayName}`;
    }

    return `uid=${Date.now().toString(36) + (guid++ % 36).toString(36) + Math.random().toString(36).slice(2, 4)}&displayName=Guest`;
}

const errors = [] as string[];
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
        this.playerRef = useRef(null);
        this.searchRef = useRef();
        this.flatListRef = useRef(null);
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

    async getSongData(
        options = {} as any,
        server: string,
        key: string,
        apiKey = 'key_1' as string
    ): Promise<any> {

        let url = clientKeysMap[server];
        const keys = Object.keys(SC_KEYS);
        const newOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };

        Object.keys(newOptions).map((k: string) => {
            url += (url.split('?')[1] ? '&' : '?') + `${k}=${newOptions[k]}`;
        });

        const apiUrl = `${url}${clientKeysMap[key]}${SC_KEYS[apiKey]}`;

        try {
            const { data } = await axios.get(apiUrl, {
                cancelToken: this.signal.token
            });
            return Promise.resolve(data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Error: ', error.message);
                errors.push(error as any);

                for (const _key of errors) {
                    if (keys.length < errors.length) {
                        return Promise.reject(error);
                    }
                    return this.getSongData(options, server, keys[errors.length]);
                }
            } else {
                console.log('Error: ', error.message);
                errors.push(error as any);

                for (const _key of errors) {
                    if (keys.length < errors.length) {
                        return Promise.reject(error);
                    }
                    return this.getSongData(options, server, key, keys[errors.length]);
                }
            }
        }
    }

    checkIfAlreadyOnList = (medias: string[], searchedMedias: string[]) => {
        medias.filter((song: any) => {
            return !searchedMedias.some((_song: any) => {
                if (song.videoDetails.videoId === _song.videoDetails.videoId && song.isMediaOnList) {
                    Object.assign(_song, {
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
