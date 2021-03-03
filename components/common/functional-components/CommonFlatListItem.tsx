/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import TouchableScale from 'react-native-touchable-scale';
import { isEmpty } from '../../../src/js/Utils/common/checkers';

const DEFAULT_AVATAR_STYLE = { width: 50, height: 50, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 };
const DEFAULT_CONTAINER_STYLE = {
    position: 'relative',
    paddingTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 0,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2
};

const CommonFlatListItem = (props: any) => {
    const {
        title,
        titleStyle,
        titleProps,
        subtitle,
        subtitleStyle,
        topDivider,
        rightTitle,
        contentContainerStyle = DEFAULT_CONTAINER_STYLE,
        leftAvatar,
        bottomDivider,
        chevron,
        action,
        avatarStyle = DEFAULT_AVATAR_STYLE,
        buttonGroup,
        friction = 90,
        tension = 100
    } = props;

    const myAvatar = (<FastImage
        style={avatarStyle}
        source={{
            uri: leftAvatar?.source.uri,
            priority: FastImage.priority.high
        }}
    />);

    return (
        <ListItem
            Component={TouchableScale}
            friction={friction}
            tension={tension}
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
                innerBorderStyle={{ width: 0 }}
                buttons={buttonGroup}
                onPress={buttonGroup.action}
                containerStyle={{
                    borderWidth: 0,
                    height: 40,
                    position: 'absolute',
                    bottom: -4,
                    right: 0,
                    paddingRight: 0,
                    backgroundColor: 'transparent'
                }}
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
    contentContainerStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    chevron: PropTypes.any,
    avatarStyle: PropTypes.object,
    buttonGroup: PropTypes.any,
    friction: PropTypes.number,
    tension: PropTypes.number
};

memo(CommonFlatListItem);

export {
    CommonFlatListItem
};
