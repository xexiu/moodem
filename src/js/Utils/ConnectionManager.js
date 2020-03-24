export function doFetch(url, options, callback) {
    return fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return Promise.resolve(callback(data));
        })
        .catch(err => {
            return Promise.reject(new Error(err.message))
        });
};