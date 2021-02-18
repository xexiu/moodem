import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

export const sideBarFooterContainer = {
    flex: 1,
    position: 'absolute',
    top: windowHeight - 50,
    left: 18,
    right: 0,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 5,
    height: 40
};
