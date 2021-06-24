export async function doFetch(url: any, options: any, callback: Function) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return await Promise.resolve(callback(data));
    } catch (err) {
        throw new Error(`doFecth() ${err.message}`);
    }
}
