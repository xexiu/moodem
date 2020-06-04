/* eslint-disable max-len */
import React, { memo, useState, useRef } from 'react';
import { TextInput, View, Text } from 'react-native';

const DEFAULT_LENGTH = 300;

export const CommonTextInput = memo(({ navigation, user, callback }) => {
    const [value, onChangeText] = useState('');
    const [maxCharacters, updateMaxCharacters] = useState(DEFAULT_LENGTH);
    const inputRef = useRef();

    return (
        <View style={{ position: 'relative' }}>
            <Text style={{ width: 50, position: 'absolute', top: -20, zIndex: 1000, color: '#999', fontStyle: 'italic', fontSize: 12 }}>{maxCharacters}</Text>
            <TextInput
                ref={inputRef}
                onKeyPress={() => console.log('Presss')}
                maxLength={DEFAULT_LENGTH}
                placeholder={'Type something...'}
                underlineColorAndroid="transparent"
                // multiline
                // numberOfLines={20}
                style={{ height: 40, borderWidth: 1, borderColor: '#ddd', textAlignVertical: 'top', borderRadius: 5, padding: 5 }}
                onChangeText={text => {
                    onChangeText(text);
                    updateMaxCharacters(DEFAULT_LENGTH - text.length);
                }}
                value={value}
                autoCorrect={false}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                    if (!user.uid) {
                        navigation.navigate('Guest');
                    } else if (value) {
                        onChangeText('');
                        updateMaxCharacters(DEFAULT_LENGTH);
                        callback(value);
                    }
                }}
            />
        </View>
    );
});
