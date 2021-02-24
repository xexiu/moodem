/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { isEmpty } from '../../../src/js/Utils/common/checkers';

const DEFAULT_AVATAR_STYLE = { width: 80, height: 80, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 };

const CommonFlatListItem = (props: any) => {
    const {
        title,
        titleStyle,
        titleProps,
        subtitle,
        subtitleStyle,
        topDivider,
        rightTitle,
        contentContainerStyle,
        leftAvatar,
        bottomDivider,
        chevron,
        action,
        avatarStyle = DEFAULT_AVATAR_STYLE,
        buttonGroup
    } = props;

    const myAvatar = (<FastImage
        style={avatarStyle}
        source={{
            uri: leftAvatar?.source.uri,
            priority: FastImage.priority.high
        }}
    />);

    return (
        <View style={{ position: 'relative' }}>
            <ListItem
                containerStyle={contentContainerStyle}
                topDivider={topDivider}
                bottomDivider={bottomDivider}
                onPress={action}
            >
                {leftAvatar && myAvatar}
                <ListItem.Content>
                    <ListItem.Title style={titleStyle}>{title}</ListItem.Title>
                    <ListItem.Subtitle style={subtitleStyle}>{subtitle}</ListItem.Subtitle>
                </ListItem.Content>
                {buttonGroup && <ListItem.ButtonGroup
                    buttons={buttonGroup}
                    onPress={buttonGroup.action}
                    containerStyle={{ borderWidth: 0, backgroundColor: '#eee', width: 120, height: 30, position: 'absolute', bottom: 0, right: 0 }}
                >
                </ListItem.ButtonGroup>
                }
                {!isEmpty(chevron) &&
                    <ListItem.Chevron
                        name={chevron.name ? chevron.name : 'check'}
                        type={chevron.type ? chevron.type : 'AntDesign'}
                        disabled={chevron.disabled}
                        disabledStyle={chevron.disabledStyle}
                        onPress={() => chevron.onPress()}
                        iconStyle={chevron.iconStyle}
                        size={chevron.size}
                        color={chevron.color}
                        containerStyle={chevron.containerStyle}
                        raised={chevron.raised}
                    />}
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
    action: PropTypes.func,
    topDivider: PropTypes.bool,
    titleProps: PropTypes.object,
    contentContainerStyle: PropTypes.object,
    chevron: PropTypes.any,
    avatarStyle: PropTypes.object,
    buttonGroup: PropTypes.any
};

memo(CommonFlatListItem);

export {
    CommonFlatListItem
};
