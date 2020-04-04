import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';

const {
    width
} = Dimensions.get('window');

export class BgImage extends Component {
	render() {
        const {
            source,
            children,
            bgImageStyle = defaultStyleLogo
        } = this.props;

		return (
			<ImageBackground
				source={source}
				style={bgImageStyle}
			>
				{children}
			</ImageBackground>
		);
	}
}

const defaultStyleLogo = {
    width,
    height: 400,
    marginTop: 50
}

BgImage.propTypes = {
	source: PropTypes.number,
	children: PropTypes.object
};