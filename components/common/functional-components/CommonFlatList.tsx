/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useRef } from 'react';
import { FlatList } from 'react-native';

const CommonFlatList = (props: any) => {
    const flatListRef = useRef(null);
    const {
        inverted,
        emptyListComponent,
        headerComponent,
        headerStyle,
        footerComponent,
        footerStyle,
        itemSeparatorComponent,
        horizontal = false,
        onContentSizeChange,
        numColumns,
        reference = flatListRef,
        data,
        extraData,
        keyExtractor = (item, index: number) => String(index),
        action = (item: any) => console.log('Item from CommonFlatList: ', item),
        viewabilityConfig,
        onViewableItemsChanged
    } = props;

    return (
        <FlatList
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            onContentSizeChange={onContentSizeChange}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
            initialNumToRender={12}
            scrollEventThrottle={15}
            maxToRenderPerBatch={10}
            ref={reference}
            inverted={inverted}
            ListEmptyComponent={emptyListComponent}
            ListHeaderComponent={headerComponent}
            ListFooterComponentStyle={headerStyle}
            ItemSeparatorComponent={itemSeparatorComponent}
            windowSize={12} // For performance (default - 21)
            keyboardShouldPersistTaps='always'
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

CommonFlatList.propTypes = {
    inverted: PropTypes.bool,
    data: PropTypes.any,
    extraData: PropTypes.any,
    keyExtractor: PropTypes.func,
    action: PropTypes.func,
    emptyListComponent: PropTypes.any,
    headerComponent: PropTypes.any,
    ref: PropTypes.any,
    onContentSizeChange: PropTypes.func,
    reference: PropTypes.any,
    viewabilityConfig: PropTypes.object,
    onViewableItemsChanged: PropTypes.func
};

memo(CommonFlatList);

export {
    CommonFlatList
};
