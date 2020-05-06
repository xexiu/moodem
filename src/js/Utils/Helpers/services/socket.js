export const IP = 'http://192.168.10.12:3000'; // Mobile --> http://172.20.10.9:3000
export const socketConf = {
    transports: ['websocket'],
    jsonp: false,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    'force new connection': true
};
