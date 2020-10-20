export const IP = 'http://192.168.0.6:3000'; // Mobile --> http://172.20.10.9:3000 Wifi home --> http://192.168.0.6:3000
export const socketConf = {
    transports: ['websocket'],
    jsonp: false,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    'force new connection': true,
    agent: false,
    perMessageDeflate: true,
    pfx: '-',
    cert: '-',
    ca: '-',
    ciphers: '-',
    rejectUnauthorized: false
    //forceNode: true // Supres YellowBox Warning --> Docs: https://socket.io/docs/client-api/#new-Manager-url-options
};
