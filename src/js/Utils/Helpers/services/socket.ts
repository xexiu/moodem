export const IP = 'http://192.168.20.26:3000'; // Mobile --> http://172.20.10.9:3000 Wifi home --> 192.168.20.26:3000 --> digital ocean: 'http://143.110.219.91:3000';
export const socketConf = {
    secure: true,
    transports: ['websocket'],
    jsonp: false,
    reconnection: true,
    // tslint:disable-next-line:max-line-length
    reconnectionDelay: 500, // starts with 0.30 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
    reconnectionDelayMax: 5000, // 1 minute (60000) maximum delay between connections
    reconnectionAttempts: 'Infinity',
    timeout: 10000000000,
    pingInterval: 25000, // default - 25000
    pingTimeout: 60000, // default - 60000
    upgrade: false,
    'force new connection': true,
    agent: false,
    perMessageDeflate: true,
    pfx: '-',
    cert: '-',
    ca: '-',
    ciphers: '-',
    rejectUnauthorized: false,
    maxHttpBufferSize: 100000000 // 100 mb
    // forceNode: true // Supres YellowBox Warning --> Docs: https://socket.io/docs/client-api/#new-Manager-url-options
};
