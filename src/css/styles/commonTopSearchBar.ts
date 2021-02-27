import { Dimensions } from 'react-native';

const {
    width
} = Dimensions.get('window');

export const commonTopSeachBarContainer = {
    width: width - 50,
    marginLeft: 35,
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderColor: '#eee',
    borderWidth: 2,
    marginTop: 5,
    marginBottom: 5
};

export const commonTopSeachBarInputContainer = {
    borderRadius: 25,
    backgroundColor: '#fff',
    height: 35
};
