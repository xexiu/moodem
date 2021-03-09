import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import SuggestionList from './SuggestionList';

const SearchBarAutoComplete = (props: any) => {
    const {
        group,
        user,
        songsOnGroup,
        navigation,
        media
    } = props;
    const [suggestions, setSuggestions] = useState([]);
    const signalToken = axios.CancelToken.source();

    useEffect(() => {
        console.log('Effect SearchBar Autocomplete');

        return () => {
            console.log('OFF SearchBar Autocomplete');
        };
    }, []);

    async function onChangeText(text: string): Promise<void> {
        const GOOGLE_AC_URL: string = `https://clients1.google.com/complete/search`;
        const res = await axios.get(GOOGLE_AC_URL, {
            cancelToken: signalToken.token,
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
        <View style={suggestions && suggestions.length && { position: 'relative', flex: 1, zIndex: 100 }}>
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
                        songsOnGroup
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
