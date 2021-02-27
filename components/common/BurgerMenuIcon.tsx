/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

const BurgerMenuIcon = (props: any) => {
    const {
      action = () => console.log('Pressed Menu Icon'),
      customStyle
    } = props;

    return (
      <Icon
          containerStyle={[{ position: 'absolute', zIndex: 1000 }, customStyle]}
          iconStyle={{ fontSize: 30 }}
          Component={TouchableScale}
          name='menu'
          type='simple-line-icons'
          raised
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

memo(BurgerMenuIcon);

export {
  BurgerMenuIcon
};
