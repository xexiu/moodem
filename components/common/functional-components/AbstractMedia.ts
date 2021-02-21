/* eslint-disable max-len */
import axios from 'axios';
import React, { useContext } from 'react';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';
import { AppContext } from '../../User/functional-components/AppContext';

const SOUNDCLOUD_API = 'https://api.soundcloud.com/tracks/?limit=50&q=';
export class AbstractMedia {
    public navigation: any;
    public user: any;
    public group: any;
    public mediaBuilder: any;
    public socket: any;
    public playerRef: any;
    public searchRef: any;
    public signal: any;
    public axios: any;

    constructor(props, api = SOUNDCLOUD_API) {
        const { user, group } = useContext(AppContext);
        this.navigation = props.navigation;
        this.user = user;
        this.group = group;
        this.mediaBuilder = new MediaBuilder();
        this.socket = this.mediaBuilder.socket();
        this.playerRef = this.mediaBuilder.playerRef();
        this.searchRef = React.createRef(null);
        this.signal = axios.CancelToken.source();
        this.axios = axios;

        this.setApi(api, this.mediaBuilder);
    }

    setApi = (api, mediaBuilder) => {
        mediaBuilder.setApi(api);
    };

    handleMediaActions = (msg, obj) => {
        if (this.user) {
            return this.mediaBuilder.msgToServer(this.socket, msg, obj);
        }

        return this.navigation.navigate('Guest');
    };

    destroy = () => {
        this.axios.Cancel();
        console.log('GROUP NAME ABSTRACT MEDIA', this.group);
        this.socket.off(this.mediaBuilder.msgFromServer);
        this.socket.close();
    };
}
