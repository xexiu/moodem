import axios from 'axios';

function baseAxios(options: any) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept-Language': options.language ? options.language : 'en',
        lang: options.lang ? options.lang : 'en',
        ...options.extraHeaders
    };

    const baseUrl = options.url;
    return axios.create({
        baseURL: baseUrl,
        timeout: options.timeout || 30000,
        headers: defaultHeaders
    });
}

function executeRequest(method: any, pathname: string, data: any, options: any) {
    const body = method === 'get' || !data ? {} : {
        data
    };
    const reqObj = {
        method,
        url: pathname,
        params: options.query,
        ...body
    };
    const baseAxiosRequest = baseAxios(options);

    return new Promise(async (resolve, reject) => {
        try {
            const res = await baseAxiosRequest
                .request(reqObj);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
}

export default {
    get(pathname: any, options: any) {
        return executeRequest('get', pathname, null, options);
    },

    post(pathname: any, data: any, options: any) {
        return executeRequest('post', pathname, data, options);
    },

    put(pathname: any, data: any, options: any) {
        return executeRequest('put', pathname, data, options);
    },

    delete(pathname: any, data: any, options: any) {
        return executeRequest('delete', pathname, data, options);
    },

    all(promises: any) {
        return axios.all(promises);
    }
};
