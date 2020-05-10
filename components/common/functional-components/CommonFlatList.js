/* eslint-disable max-len */
import React, { useRef } from 'react';
import { FlatList } from 'react-native';

export const CommonFlatList = (props) => {
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
    } = props;
    const flatListRef = useRef(null);

    return (
        <FlatList
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd()}
            onLayout={() => { flatListRef.current.scrollToEnd({ animated: true }); }}
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
};
