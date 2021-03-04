/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React, { memo, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const DEFAULT_LENGTH = 300;

const CommonTextInput = ({ navigation, user, group, media }: any) => {
    const [value, onChangeText] = useState('');
    const [maxCharacters, updateMaxCharacters] = useState(DEFAULT_LENGTH);
    const inputRef = useRef(null);

    function buildMsg() {
        return {
            id: Object.keys(user || {}).length ? `${user.uid}_${Math.random()}` : Math.random(),
            text: value ? value.replace(/^\s*\n/gm, '') : '',
            user
        };
    }

    return (
        <View style={{ position: 'relative' }}>
            <Text style={{ width: 50, position: 'absolute', top: 0, right: -20, zIndex: 1000, color: '#999', fontStyle: 'italic', fontSize: 12 }}>{maxCharacters}</Text>
            <TextInput
                ref={inputRef}
                maxLength={DEFAULT_LENGTH}
                placeholder={'Escribe algo...'}
                underlineColorAndroid='transparent'
                // multiline
                // numberOfLines={20}
                style={{
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    textAlignVertical: 'top',
                    borderRadius: 5,
                    padding: 5
                }}
                onChangeText={text => {
                    onChangeText(text);
                    updateMaxCharacters(DEFAULT_LENGTH - text.length);
                }}
                value={value}
                autoCorrect={false}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                    if (!user) {
                        navigation.navigate('Guest');
                    } else if (value) {
                        onChangeText('');
                        updateMaxCharacters(DEFAULT_LENGTH);
                        media.emit('chat-messages',
                            {
                                chatRoom: `${group.group_name}-ChatRoom-${group.group_id}`,
                                msg: buildMsg(),
                                user
                            });
                    }
                }}
            />
        </View>
    );
};

CommonTextInput.propTypes = {
    navigation: PropTypes.object,
    user: PropTypes.any,
    group: PropTypes.any,
    media: PropTypes.any
};

export default memo(CommonTextInput);
