import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Dimensions } from 'react-native';

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
		<ImageBackground
			source={source}
			style={bgImageStyle}
		>
			{children}
		</ImageBackground>
	);
};

const defaultStyleLogo = {
    width,
    height: 400,
    marginTop: 50
};

BgImage.propTypes = {
	source: PropTypes.number,
	children: PropTypes.object
};
