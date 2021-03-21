import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import SuggestionList from './SuggestionList';

const SearchBarAutoComplete = (props: any) => {
    const {
        group,
        user,
        songsOnGroup,
        navigation,
        media,
        resetLoadingSongs
    } = props;
    const isFocused = useIsFocused();
    const [suggestions, setSuggestions] = useState([]);
    const source = axios.CancelToken.source();

    useEffect(() => {
        // console.log('Effect SearchBar Autocomplete');

        if (isFocused) {
            setSuggestions([]);
        }

        return () => {
            setSuggestions([]);
            source.cancel('SearchBarAutoComplete Component got unmounted');
            // console.log('OFF SearchBar Autocomplete');
        };
    }, [isFocused]);

    async function onChangeText(text: string): Promise<void> {
        const GOOGLE_AC_URL: string = `https://clients1.google.com/complete/search`;
        const res = await axios.get(GOOGLE_AC_URL, {
            cancelToken: source.token,
            params: {
                client: 'youtube',
                ds: 'yt',
                q: text
            }
        });
        if (res.status !== 200) {
            throw Error('Suggest API not 200!');
        }
        const cleanResp = res.data.replace('window.google.ac.h(', '').replace(')', '');
        const parsedData = JSON.parse(cleanResp);
        const _suggestions = [] as any;
        parsedData[1].map((item: any[]) => {
            _suggestions.push(item[0]);
        });
        setSuggestions(_suggestions);
    }

    return (
        <View
            style={suggestions && suggestions.length && {
                position: 'absolute',
                flex: 1,
                zIndex: 100,
                left: 4,
                right: 0,
                top: 0
            }}
        >
            <CommonTopSearchBar
                placeholder='Encuentra una canción...'
                cancelSearch={() => setSuggestions([])}
                onChangeText={onChangeText}
                onEndEditingSearch={(searchedText) => {
                    setSuggestions([]);
                    navigation.navigate('SearchingSongsScreen', {
                        media,
                        group,
                        user,
                        searchedText,
                        songsOnGroup,
                        resetLoadingSongs
                    });
                }}
                searchRef={media.searchRef}
            />

            <SuggestionList
                songsOnGroup={songsOnGroup}
                user={user}
                group={group}
                navigation={navigation}
                media={media}
                suggestions={suggestions}
            />
        </View>
    );
};

export default memo(SearchBarAutoComplete);
