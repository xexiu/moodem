/* eslint-disable max-len */
import React from 'react';
import { View, FlatList } from 'react-native';

export const CommonFlatList = (props) => {
    const {
        emptyListComponent,
        headerComponent,
        headerStyle,
        footerComponent,
        footerStyle,
        itemSeparatorComponent,
        horizontal = false,
        numColumns,
        data,
        action = (item) => console.log('Item from CommonFlatList: ', item)
    } = props;

    return (
        <FlatList
            ListEmptyComponent={emptyListComponent}
            ListHeaderComponent={headerComponent}
            ListFooterComponentStyle={headerStyle}
            ItemSeparatorComponent={itemSeparatorComponent}
            windowSize={12} // For performance (default - 21)
            keyboardShouldPersistTaps="always"
            horizontal={horizontal}
            numColumns={numColumns}
            data={data}
            renderItem={item => action(item)}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={footerComponent}
            ListFooterComponentStyle={footerStyle}
        />
    );
};
