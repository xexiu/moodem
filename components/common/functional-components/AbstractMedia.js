/* eslint-disable max-len */
import React, { useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../User/functional-components/UserContext';
import { MediaBuilder } from '../../../src/js/Utils/Helpers/actions/common';

export class AbstractMedia {
    constructor(props, api) {
        const { user } = useContext(UserContext);
        const { group } = useContext(UserContext);
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
    }

    handleMediaActions = (msg, obj) => {
        if (this.user) {
            return this.mediaBuilder.msgToServer(this.socket, msg, obj);
        }

        return this.navigation.navigate('Guest');

        // else if (this.user && !media.hasBoosted && actionName === 'boost') {
        //     this.socket.emit(`send-message-${actionName}`, { media, chatRoom: 'global-moodem-songsPlaylist', user_id: this.user.uid, count });
        // }
    }

    destroy = () => {
        this.axios.Cancel();
        this.socket.emit('disconnect');
        this.socket.off(this.mediaBuilder.msgFromServer);
        this.socket.close();
    }
}
