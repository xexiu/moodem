import axios from 'axios';
import React, { memo, useState } from 'react';
import { View } from 'react-native';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import SuggestionList from './SuggestionList';

const GOOGLE_AC_URL: string = `https://clients1.google.com/complete/search`;

const SearchBarAutoComplete = (props: any) => {
    const {
        chatRoom,
        songs,
        navigation
    } = props;
    const [suggestions, setSuggestions] = useState([]);
    const source = axios.CancelToken.source();

    function handleEndSearch(searchedText: string) {
        setSuggestions([]);

        return navigation.navigate('SearchSongScreen', {
            chatRoom,
            searchedText
        });
    }

    async function onChangeText(text: string): Promise<void> {
        try {
            const response = await axios.get(GOOGLE_AC_URL, {
                cancelToken: source.token,
                params: {
                    client: 'youtube',
                    ds: 'yt',
                    q: text
                }
            });
            if (response.status !== 200) {
                throw Error('Suggest API not 200!');
            }
            const cleanResp = response.data.replace('window.google.ac.h(', '').replace(')', '');
            const parsedData = JSON.parse(cleanResp);
            const _suggestions = [] as any;
            parsedData[1].map((item: any[]) => {
                _suggestions.push(item[0]);
            });
            setSuggestions(_suggestions);
        } catch (error) {
            throw error;
        }
    }

    return (
        <View
            style={suggestions && suggestions.length && {
                position: 'absolute',
                flex: 1,
                zIndex: 1000,
                left: 4,
                right: 0,
                top: 0
            }}
        >
            <CommonTopSearchBar
                placeholder={translate('songs.searchBar.placeholderSearch')}
                cancelSearch={() => setSuggestions([])}
                onChangeText={onChangeText}
                onEndEditingSearch={handleEndSearch}
            />

            <SuggestionList
                songs={songs}
                navigation={navigation}
                suggestions={suggestions}
            />
        </View>
    );
};

export default memo(SearchBarAutoComplete);
