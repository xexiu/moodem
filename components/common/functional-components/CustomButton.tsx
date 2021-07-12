import React, { memo } from 'react';
import { Button } from 'react-native-elements';
import { btnStyleDefault } from '../../../src/css/styles/customButton';

function defaultAction(evt) {
    // eslint-disable-next-line
    return console.log('Button Pressed CustomButton');
}

type PropsCustomBtn = {
    btnTitle?: string | React.ReactElement,
    btnStyle?: string[] | object,
    btnType?: 'solid' | 'clear' | 'outline',
    btnCustomStyle?: object,
    btnTitleStyle?: object,
    btnRaised?: boolean,
    shadow?: object,
    action?: any,
    btnDisabled?: boolean,
    btnIcon?: any,
    btnViewComponent?: any
};

const CustomButton = (props: PropsCustomBtn) => {
    const {
        btnDisabled = false,
        btnTitle = 'No button title provided!',
        btnTitleStyle,
        btnStyle = btnStyleDefault,
        btnCustomStyle,
        btnRaised = false,
        btnType = 'solid',
        btnIcon,
        shadow = {}, // btnShadow,
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

export default memo(CustomButton);
