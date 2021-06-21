/* eslint-disable max-len */
import React, { Component } from 'react';
import { FlatList } from 'react-native';

type CommonFlatListProps = {
    inverted?: boolean,
    emptyListComponent?: any,
    headerComponent?: any,
    headerStyle?: object,
    footerComponent?: any,
    footerStyle?: object,
    itemSeparatorComponent?: any,
    horizontal?: boolean,
    onContentSizeChange?: any,
    numColumns?: number,
    reference?: any,
    data: any,
    extraData?: any,
    keyExtractor: any,
    action: Function,
    viewabilityConfig?: any,
    onViewableItemsChanged?: any,
    style?: Object,
    keyboardShouldPersistTaps?: string
};

export default class CommonFlatList extends Component<CommonFlatListProps> {

    render() {
        const flatListRef = React.createRef();
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
            keyExtractor = (item: any, index: number) => String(index),
            action = (item: any) => console.log('Item from CommonFlatList: ', item),
            viewabilityConfig,
            onViewableItemsChanged,
            style
        } = this.props;
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
                maxToRenderPerBatch={1}
                scrollEventThrottle={15}
                ref={reference}
                inverted={inverted}
                ListEmptyComponent={emptyListComponent}
                ListHeaderComponent={headerComponent}
                ListHeaderComponentStyle={headerStyle}
                ItemSeparatorComponent={itemSeparatorComponent}
                windowSize={5} // For performance (default - 21)
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
