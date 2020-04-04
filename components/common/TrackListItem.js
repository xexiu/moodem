import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';

export class TrackListItem extends Component {
    render() {
        const {
            itemProps,
            actionOnPressItem = () => { console.log('Item from list has been pressed!') }
        } = this.props

        return (
            <View>
                <ListItem
                    bottomDivider
                    Component={TouchableOpacity}
                    title={itemProps.name}
                    onPress={() => {
                        this.props.actionOnPressItem(itemProps);
                    }}
                />
            </View>
        )
    }
}