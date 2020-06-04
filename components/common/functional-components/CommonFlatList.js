/* eslint-disable max-len */
import React, { Component } from 'react';
import { FlatList } from 'react-native';

export class CommonFlatList extends Component {
    constructor(props) {
        super(props);
        this.flatListRef = React.createRef(null);
    }

    render() {
        const {
            inverted,
            emptyListComponent,
            headerComponent,
            headerStyle,
            footerComponent,
            footerStyle,
            itemSeparatorComponent,
            horizontal = false,
            numColumns,
            data,
            extraData,
            keyExtractor = (item, index) => index.toString(),
            action = (item) => console.log('Item from CommonFlatList: ', item)
        } = this.props;

        return (
            <FlatList
                initialNumToRender={7}
                scrollEventThrottle={15}
                ref={this.flatListRef}
                inverted={inverted}
                ListEmptyComponent={emptyListComponent}
                ListHeaderComponent={headerComponent}
                ListFooterComponentStyle={headerStyle}
                ItemSeparatorComponent={itemSeparatorComponent}
                windowSize={12} // For performance (default - 21)
                keyboardShouldPersistTaps="always"
                horizontal={horizontal}
                numColumns={numColumns}
                data={data}
                extraData={extraData}
                renderItem={item => action(item)}
                keyExtractor={keyExtractor}
                ListFooterComponent={footerComponent}
                ListFooterComponentStyle={footerStyle}
            />
        );
    }
}
