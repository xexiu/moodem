import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Button } from 'react-native-elements';
import { btnShadow } from '../../../src/css/styles/common';
import { btnStyleDefault } from '../../../src/css/styles/customButton';

function defaultAction(evt) {
    // eslint-disable-next-line
    return console.log('Button Pressed CustomButton');
}

const CustomButton = (props: any) => {
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
};

CustomButton.propTypes = {
    btnTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    btnStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    btnCustomStyle: PropTypes.object,
    btnTitleStyle: PropTypes.object,
    btnRaised: PropTypes.bool,
    shadow: PropTypes.object,
    action: PropTypes.func,
    btnDisabled: PropTypes.bool,
    btnIcon: PropTypes.element,
    btnViewComponent: PropTypes.elementType
};

export default memo(CustomButton);
