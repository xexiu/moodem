import React, { memo } from 'react';
import { Button } from 'react-native-elements';
import { btnStyleDefault } from '../../../src/css/styles/customButton';
import { btnShadow } from '../../../src/css/styles/common';

function defaultAction(evt) {
	// eslint-disable-next-line
	return console.log('Button Pressed CustomButton: ', this.props);
}

export const CustomButton = memo(props => {
	const {
		btnDisabled = false,
		btnTitle = 'No button title provided!',
		btnTitleStyle,
		btnStyle = btnStyleDefault,
		btnCustomStyle,
		btnRaised = false,
		btnType = 'solid',
		btnIcon,
		shadow = btnShadow,
		btnViewComponent,
		action = defaultAction.bind(this)
	} = props;

	return (
		<Button
			disabled={btnDisabled}
			icon={btnIcon}
			loading={false}
			title={btnTitle}
			type={btnType}
			raised={btnRaised}
			buttonStyle={[btnStyle, shadow, btnCustomStyle]}
			titleStyle={btnTitleStyle}
			onPress={action}
			ViewComponent={btnViewComponent}
		/>
	);
});
