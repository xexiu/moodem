import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

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

export {
    useFetch
};
