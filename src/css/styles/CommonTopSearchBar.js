import { Dimensions } from 'react-native';

const MARGIN_RIGHT = 80;
const {
    width
} = Dimensions.get('window');

export const CommonTopSeachBarContainer = {
    width: width - MARGIN_RIGHT,
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderColor: '#eee',
    borderWidth: 2,
    marginLeft: 70
};

export const CommonTopSeachBarInputContainer = {
    borderRadius: 25,
    backgroundColor: '#fff',
    height: 35
};
