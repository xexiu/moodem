import React from 'react';
import { Text } from 'react-native';
import { getCurrentYear } from '../../../src/js/Utils/common/date';

const year = getCurrentYear();

export const CommonFlatListFooter = () => (
    <Text>Footer List Component {year}</Text>
);
