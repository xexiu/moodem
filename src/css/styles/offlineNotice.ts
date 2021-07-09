import { Dimensions, TextStyle, ViewStyle } from 'react-native';

const { width } = Dimensions.get('window');

export const offlineContainer = {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 35
} as ViewStyle;

export const offlineText = {
    color: '#fff'
} as TextStyle;
