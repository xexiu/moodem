import { Dimensions } from 'react-native';

const {
    width
} = Dimensions.get('window');

export const CommonTopSeachBarContainer = {
    width,
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderColor: '#eee',
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 5
};

export const CommonTopSeachBarInputContainer = {
    borderRadius: 25,
    backgroundColor: '#fff',
    height: 35
};
