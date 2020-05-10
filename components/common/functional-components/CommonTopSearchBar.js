import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SearchBar } from 'react-native-elements';
import {
    commonTopSeachBarContainer,
    commonTopSeachBarInputContainer
} from '../../../src/css/styles/commonTopSearchBar';

export const CommonTopSearchBar = (props) => {
    const {
        placeholder,
        onEndEditingSearch,
        cancelSearch
    } = props;
    const [value = '', setValue] = useState('');
    const [showLoadingSpin = false, setShowLoadingSpin] = useState(false);

    useEffect(() => () => {
        axios.Cancel();
    }, []);

    return (
        <SearchBar
            autoCorrect={false}
            containerStyle={commonTopSeachBarContainer}
            inputContainerStyle={commonTopSeachBarInputContainer}
            lightTheme
            clearIcon={{
                onPress: () => setValue('')
            }}
            placeholder={placeholder}
            onChangeText={text => setValue(text) && setShowLoadingSpin(false)}
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
};
