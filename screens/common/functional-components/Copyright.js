import React from 'react';
import { Text, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const Copyright = (props) => {
    const {
        color
    } = props;

    return (
        <Text>© <Text style={color}>Mood</Text>em</Text>
    );
};

Copyright.containerStyle = {
    borderTopColor: '#eee',
    borderTopWidth: 1,
    position: 'absolute',
    top: windowHeight - 50,
    left: 0,
    right: 0
};

export {
    Copyright
};
