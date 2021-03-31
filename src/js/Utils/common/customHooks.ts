import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { AbstractMedia } from '../../../../components/common/functional-components/AbstractMedia';

const media = new AbstractMedia();

function withDependencyOrDefault(withDefault: any, dependency: any) {
    return dependency ? [withDefault, dependency] : [withDefault];
}

const useFetch = (url: string, params?: any, initialValue?: any) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(true);
    const source = axios.CancelToken.source();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(url, {
                cancelToken: source.token,
                params: params || {}
            });
            if (response.status === 200) {
                setData(response.data);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { loading, data };
};

const useEventsSockets = (eventNameEmit: string, eventNameOn: string, obj?: object, dependency?: any, initialValue?: any) => {
    const [data, setData] = useState(initialValue);
    const [loading, setLoading] = useState(true);

    const callEvent = useCallback(async () => {
        try {
            setLoading(true);
            await media.on(eventNameOn, (_data: any) => {
                setData(_data);
            });
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, [eventNameOn]);

    useEffect(() => {
        media.emit(eventNameEmit, obj);
        callEvent();

        return () => {
            media.socket.off(eventNameOn);
        };
    }, withDependencyOrDefault(callEvent, dependency));

    return { loading, data };
};

export {
    useFetch,
    useEventsSockets
};
