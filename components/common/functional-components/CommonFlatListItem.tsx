/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';

const CommonFlatListItem = (props: any) => {
    const {
        title,
        titleStyle,
        subtitle,
        subtitleStyle,
        rightTitle,
        leftAvatar,
        bottomDivider,
        action
    } = props;

    const myAvatar = (<FastImage
        style={{ width: 30, height: 30, borderRadius: 10, borderColor: '#ddd', borderWidth: 1 }}
        source={{
            uri: leftAvatar.source.uri,
            priority: FastImage.priority.high
        }}
    />);

    return (
        <View style={{ position: 'relative' }}>
            <ListItem topDivider>
                {myAvatar}
                <ListItem.Content>
                    <ListItem.Title style={titleStyle}>{title}</ListItem.Title>
                    <ListItem.Subtitle style={subtitleStyle}>{subtitle}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </View>
    );
};

CommonFlatListItem.propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    subtitle: PropTypes.string,
    subtitleStyle: PropTypes.object,
    leftAvatar: PropTypes.object,
    bottomDivider: PropTypes.bool,
    rightTitle: PropTypes.string,
    action: PropTypes.func
};

memo(CommonFlatListItem);

export {
    CommonFlatListItem
};
