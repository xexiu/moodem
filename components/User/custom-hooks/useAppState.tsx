import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

const FIVE_SECODS = 5000;

const isAndroid = Platform.OS !== 'ios';
const isIPhone = Platform.OS === 'ios';

function useAppState() {
    const appState = useRef(AppState.currentState);
    const [socket, setSocket] = useState(null) as any;
    let timer = 0;

    const _handleAppStateChange = async (data: any) => {
        if (data === 'active') {
            // clearInterval when your app has come back to the foreground
            if (timer) {
                await BackgroundTimer.clearInterval(timer);
            }
            if (isAndroid) {
                await BackgroundTimer.stopBackgroundTimer();
            }
            await BackgroundTimer.stop();
        } else {
            // app goes to background
            // tell the server that your app is still online when your app detect that it goes to background
            if (isIPhone) {
                await BackgroundTimer.start();
                timer = BackgroundTimer.setInterval(() => {
                    socket.emit('app-goes-to-background');
                }, FIVE_SECODS);
            } else {
                BackgroundTimer.runBackgroundTimer(() => {
                    socket.emit('app-goes-to-background');
                }, FIVE_SECODS);
            }
            appState.current = data;
        }
    };

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, [socket]);
    return { setSocket };
}

export default useAppState;
