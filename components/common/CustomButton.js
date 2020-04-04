import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import styles from '../../src/css/styles/CustomButton.scss';

function defaultAction(evt) {
	// eslint-disable-next-line
	return console.log('Button Pressed CustomButton: ', this.props);
}

export class CustomButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingButton: false
		}
	}

	updateLoadingBtn = (isActive) => {
		this.setState({ loadingButton: isActive });
	}
	render() {
		const {
			btnTitle = 'No btn title!',
			btnTitleStyle = 'btn-title_default',
			btnStyle,
			btnRaised = false,
			btnType = 'solid',
			btnOnPress = defaultAction.bind(this),
			btnIcon
		} = this.props;
		const {
			loadingButton
		} = this.state;

		return (
			<Button
				icon={btnIcon}
				loading={loadingButton}
				title={btnTitle}
				type={btnType}
				raised={btnRaised}
				buttonStyle={[styles[btnStyle], btnShadow]}
				titleStyle={styles[btnTitleStyle]}
				onPress={btnOnPress}
			/>
		);
	}
}

const btnShadow = {
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 2,
	},
	shadowOpacity: 0.25,
	shadowRadius: 3.84,
	elevation: 5
}

CustomButton.propTypes = {
	btnStyle: PropTypes.string,
	btnTitleStyle: PropTypes.string,
	btnTitle: PropTypes.string,
	btnLoading: PropTypes.bool,
	btnType: PropTypes.string,
	btnOnPress: PropTypes.func,
	btnRaised: PropTypes.bool,
	btnIcon: PropTypes.node
};