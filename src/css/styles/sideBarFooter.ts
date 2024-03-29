import { ViewStyle } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import { height } from '../../js/Utils/common/devices';

export const sideBarFooterContainer = {
    flex: 1,
    position: 'absolute',
    top: hasNotch() ? height - 115 : height - 55,
    left: 18,
    right: 0,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 5,
    height: 40
} as ViewStyle;
