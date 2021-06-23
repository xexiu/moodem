import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import {
    commonTopSeachBarContainer,
    commonTopSeachBarInputContainer
} from '../../../src/css/styles/commonTopSearchBar';

const controller = new AbortController();

type SearchBarProps = {
    placeholder?: string,
    onChangeText?: any,
    onEndEditingSearch: Function,
    cancelSearch?: Function,
    searchRef?: any,
    customStyleContainer?: any,
    placeholderTextColor?: string
};

const CommonTopSearchBar = (props: SearchBarProps) => {
    const {
        placeholder,
        onChangeText,
        onEndEditingSearch,
        cancelSearch,
        searchRef,
        customStyleContainer,
        placeholderTextColor = '#ccc'
    } = props;
    const [value, setValue] = useState('');
    const isFocused = useIsFocused();

    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, [isFocused]);

    function handleOnChangeText(text: string) {
        setValue(text);
        if (onChangeText) {
            return onChangeText(text);
        }
        return null;
    }

    return (
        <SearchBar
            placeholderTextColor={placeholderTextColor}
            ref={searchRef}
            autoCorrect={false}
            containerStyle={[commonTopSeachBarContainer, customStyleContainer]}
            inputContainerStyle={commonTopSeachBarInputContainer}
            lightTheme
            placeholder={placeholder}
            onChangeText={handleOnChangeText}
            value={value}
            onClear={() => !!value}
            showLoading={!!value}
            onCancel={() => cancelSearch()}
            onEndEditing={() => {
                if (value) {
                    setValue('');
                    onEndEditingSearch && onEndEditingSearch(value);
                }
            }}
        />
    );
};

export default memo(CommonTopSearchBar);
