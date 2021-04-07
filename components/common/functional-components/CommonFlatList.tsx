/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
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
        onViewableItemsChanged,
        style
    } = props;

    return (
        <FlatList
            style={style}
            removeClippedSubviews={true}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            onContentSizeChange={onContentSizeChange}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            scrollEventThrottle={15}
            ref={reference}
            inverted={inverted}
            ListEmptyComponent={emptyListComponent}
            ListHeaderComponent={headerComponent}
            ListHeaderComponentStyle={headerStyle}
            ItemSeparatorComponent={itemSeparatorComponent}
            windowSize={5} // For performance (default - 21)
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
    footerComponent: PropTypes.any,
    headerStyle: PropTypes.any,
    ref: PropTypes.any,
    onContentSizeChange: PropTypes.func,
    reference: PropTypes.any,
    viewabilityConfig: PropTypes.object,
    onViewableItemsChanged: PropTypes.func,
    style: PropTypes.object
};

export default memo(CommonFlatList);
