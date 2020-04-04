export function doFetch(url, options, callback) {
    return fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return Promise.resolve(callback(data));
        })
        .catch(err => {
            throw new Error('doFecth()', err.message);
        });
};