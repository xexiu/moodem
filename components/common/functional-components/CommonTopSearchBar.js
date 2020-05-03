import React, { useState } from 'react';
import { SearchBar } from 'react-native-elements';
import {
    CommonTopSeachBarContainer,
    CommonTopSeachBarInputContainer
} from '../../../src/css/styles/CommonTopSearchBar';

export const CommonTopSearchBar = (props) => {
    const {
        placeholder,
        onEndEditingSearch
    } = props;
    const [value = '', setValue] = useState('');
    const [showLoadingSpin = false, setShowLoadingSpin] = useState(false);

    return (
        <SearchBar
            autoCorrect={false}
            containerStyle={CommonTopSeachBarContainer}
            inputContainerStyle={CommonTopSeachBarInputContainer}
            lightTheme
            clearIcon={showLoadingSpin}
            placeholder={placeholder}
            onChangeText={text => setValue(text)}
            value={value}
            onClear={() => setShowLoadingSpin(false)}
            showLoading={showLoadingSpin}
            onCancel={() => setShowLoadingSpin(false)}
            onEndEditing={() => {
                setShowLoadingSpin(true);
                onEndEditingSearch(value)
                    .then(() => {
                        setShowLoadingSpin(false);
                        setValue('');
                    });
            }}
        />
    );
};
