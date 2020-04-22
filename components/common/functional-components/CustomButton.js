import React from 'react';
import { Button } from 'react-native-elements';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { btnShadow } from '../../../src/css/styles/common';

function defaultAction(evt) {
	// eslint-disable-next-line
	return console.log('Button Pressed CustomButton: ', this.props);
}

export const CustomButton = (props) => {
	const {
		btnTitle = 'No button title provided!',
		btnTitleStyle,
		btnStyle = btnStyleDefault,
		btnRaised = false,
		btnType = 'solid',
		btnOnPress = defaultAction.bind(this),
		btnIcon
	} = props;

	return (
		<Button
			icon={btnIcon}
			loading={false}
			title={btnTitle}
			type={btnType}
			raised={btnRaised}
			buttonStyle={[btnStyle, btnShadow]}
			titleStyle={btnTitleStyle}
			onPress={btnOnPress}
		/>
	);
};
