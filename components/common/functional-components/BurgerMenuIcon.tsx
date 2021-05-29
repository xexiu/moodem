/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const DEFAULT_CONTAINER_STYLE = {
    position: 'absolute',
    zIndex: 1000,
    top: 10,
    left: 5,
    width: 30,
    height: 30,
    alignItems: 'center'
};

const BurgerMenuIcon = (props: any) => {
    const {
      action = () => console.log('Pressed Menu Icon'),
      customStyle
    } = props;

    return (
      <Icon
          containerStyle={[
              DEFAULT_CONTAINER_STYLE
            , customStyle]}
          iconStyle={{ fontSize: 25 }}
          Component={TouchableScale}
          name='menu'
          type='simple-line-icons'

          size={15}
          color='#444'
          onPress={action}
      />
    );
};

BurgerMenuIcon.propTypes = {
    action: PropTypes.func,
    customStyle: PropTypes.object
};

export default memo(BurgerMenuIcon);
