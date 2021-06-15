import NetInfo from '@react-native-community/netinfo';

export async function checkConnection() {
    await NetInfo.fetch().then(connection => connection.isConnected);
}
