import NetInfo from '@react-native-community/netinfo';

export function checkConnection() {
    return NetInfo.fetch().then(connection => connection.isConnected);
}
