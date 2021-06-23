import { Dimensions } from 'react-native';

const {
    width
} = Dimensions.get('window');

export const commonTopSeachBarContainer = {
    marginLeft: 35,
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderColor: '#eee',
    borderWidth: 2,
    marginBottom: 5,
    marginTop: 5
};

export const commonTopSeachBarInputContainer = {
    borderRadius: 20,
    backgroundColor: '#fff',
    height: 35
};
