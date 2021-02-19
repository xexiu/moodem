export function doFetch(url, options, callback) {
    return fetch(url, options)
        .then(response => response.json())
        .then(data => Promise.resolve(callback(data)))
        .catch(err => {
            throw new Error('doFecth()', err.message);
        });
}
