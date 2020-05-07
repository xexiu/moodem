import axios from 'axios';
import { useContext } from 'react';
import { checkIfAlreadyOnList, getData } from '../../../src/js/Utils/Helpers/actions/common';
import { filterCleanData } from '../../../src/js/Utils/Helpers/actions/songs';
import { UserContext } from '../../User/functional-components/UserContext';

export default class MediaAbstract {
    constructor(apiUrl) {
        this.user = useContext(UserContext).user;
        this.apiUrl = apiUrl;
        this.signal = axios.CancelToken.source();
    }

    setApiUrl(apiUrl) {
        this.apiUrl = apiUrl;
    }

    getApiUrl() {
        return this.apiUrl;
    }
}
