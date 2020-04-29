import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Dimensions } from 'react-native';

const {
	width
} = Dimensions.get('window');

export const BgImage = props => {
	const {
		source,
		children,
		bgImageStyle = defaultStyleLogo
	} = props;

	return (
		<View>
			<ImageBackground
				source={source}
				style={bgImageStyle}
			/>
			{children}
		</View>
	);
};

const defaultStyleLogo = {
	width,
	height: 400,
	marginTop: 50
};

BgImage.propTypes = {
	source: PropTypes.object,
	children: PropTypes.object
};
