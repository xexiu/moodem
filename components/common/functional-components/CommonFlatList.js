/* eslint-disable max-len */
import React, { useRef, memo } from 'react';
import { FlatList } from 'react-native';

export const CommonFlatList = memo((props) => {
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
        keyExtractor = (item, index) => String(index),
        action = (item) => console.log('Item from CommonFlatList: ', item)
    } = props;
    const flatListRef = useRef(null);

    return (
        <FlatList
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            initialNumToRender={12}
            scrollEventThrottle={15}
            ref={flatListRef}
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
});
