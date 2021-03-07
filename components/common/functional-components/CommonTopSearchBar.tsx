import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import {
    commonTopSeachBarContainer,
    commonTopSeachBarInputContainer
} from '../../../src/css/styles/commonTopSearchBar';

const controller = new AbortController();

const CommonTopSearchBar = (props: any) => {
    const {
        placeholder,
        onChangeText,
        onEndEditingSearch,
        cancelSearch,
        searchRef,
        customStyleContainer
    } = props;
    const [value, setValue] = useState('');
    const [showLoadingSpin, setShowLoadingSpin] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, [isFocused]);

    return (
        <SearchBar
            placeholderTextColor={'#ccc'}
            ref={searchRef}
            autoCorrect={false}
            containerStyle={[commonTopSeachBarContainer, customStyleContainer]}
            inputContainerStyle={commonTopSeachBarInputContainer}
            lightTheme
            clearIcon={!!value && {
                onPress: () => {
                    setValue('');
                    cancelSearch();
                }
            }}
            placeholder={placeholder}
            onChangeText={text => {
                setValue(text);
                setShowLoadingSpin(true);
                if (onChangeText && onChangeText(text)) {
                    onChangeText(text)
                    .then(() => {
                        setShowLoadingSpin(false);
                    });
                }
            }}
            value={value}
            onClear={() => setShowLoadingSpin(false)}
            showLoading={showLoadingSpin}
            onCancel={() => cancelSearch()}
            onEndEditing={() => {
                if (value) {
                    setShowLoadingSpin(false);
                    setValue('');
                    onEndEditingSearch && onEndEditingSearch(value);
                }
            }}
        />
    );
};

CommonTopSearchBar.propTypes = {
    placeholder: PropTypes.string,
    onChangeText: PropTypes.func,
    onEndEditingSearch: PropTypes.func,
    cancelSearch: PropTypes.func,
    searchRef: PropTypes.any,
    customStyleContainer: PropTypes.object
};

export default memo(CommonTopSearchBar);
