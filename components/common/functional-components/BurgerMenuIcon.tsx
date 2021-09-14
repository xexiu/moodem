import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const DEFAULT_CONTAINER_STYLE = {
    position: 'absolute',
    zIndex: 1000,
    top: 7,
    left: 5,
    width: 30,
    height: 30,
    alignItems: 'center'
};

type PropsBurgerMenuIcon = {
    action?: any,
    customStyle?: object
};

function defaultOnPress() { }

const BurgerMenuIcon = ({ action = defaultOnPress(), customStyle }: PropsBurgerMenuIcon) => {
    return (
        <Icon
            containerStyle={[
                DEFAULT_CONTAINER_STYLE
                , customStyle]}
            Component={TouchableScale}
            name='menu'
            type='Entypo'
            size={35}
            color='#444'
            onPress={action}
        />
    );
};

export default memo(BurgerMenuIcon);
