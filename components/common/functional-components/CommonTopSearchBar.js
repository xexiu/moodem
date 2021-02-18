import axios from 'axios';
import React, { useState, useEffect, memo } from 'react';
import { SearchBar } from 'react-native-elements';
import {
    commonTopSeachBarContainer,
    commonTopSeachBarInputContainer
} from '../../../src/css/styles/commonTopSearchBar';

export const CommonTopSearchBar = memo((props) => {
    const {
        placeholder,
        onEndEditingSearch,
        cancelSearch,
        searchRef,
        customStyleContainer
    } = props;
    const [value = '', setValue] = useState('');
    const [showLoadingSpin = false, setShowLoadingSpin] = useState(false);

    useEffect(() => () => {
        axios.Cancel();
    }, []);

    return (
        <SearchBar
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
                setShowLoadingSpin(false);
                cancelSearch();
            }}
            value={value}
            onClear={() => setShowLoadingSpin(false)}
            showLoading={showLoadingSpin}
            onCancel={() => cancelSearch()}
            onEndEditing={() => {
                if (value) {
                    setShowLoadingSpin(true);
                    onEndEditingSearch(value)
                        .then(() => {
                            setShowLoadingSpin(false);
                            setValue('');
                        });
                }
            }}
        />
    );
});
