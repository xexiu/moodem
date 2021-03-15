import React, { Component, PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default class TestItem extends Component {
    constructor(props) {
        super(props);
        console.log('Constructor TestItem');
    }
    render() {
        console.log('Change Item');

        const { item, index } = this.props;
        return (
            <View style={{ height: 300 }}>
                {console.log('rendering', index)}
                <Text>{item}</Text>
            </View>
        );
    }
}
