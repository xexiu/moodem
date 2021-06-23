export function doFetch(url: any, options: any, callback: Function) {
    return fetch(url, options)
        .then(response => response.json())
        .then(data => Promise.resolve(callback(data)))
        .catch(err => {
            throw new Error(`doFecth() ${err.message}`);
        });
}
