import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Dimensions } from 'react-native';

const DEFAULT_LOGO = 'https://firebasestorage.googleapis.com/v0/b/moodem-91e22.appspot.com/o/assets%2Fimages%2Flogo_moodem.png?alt=media&token=56b0fc0f-d243-451f-bd94-a3fe9f7b025f';

const {
	width
} = Dimensions.get('window');

export const BgImage = props => {
	const {
		source = { uri: DEFAULT_LOGO },
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
	source: PropTypes.object
};
