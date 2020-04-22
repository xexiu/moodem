import { Dimensions } from 'react-native';

const {
    width
} = Dimensions.get('window');

export const btnShadow = {
	shadowColor: '#000',
	shadowOffset: {
		width: 0,
		height: 2,
	},
	shadowOpacity: 0.25,
	shadowRadius: 3.84,
	elevation: 5
};
