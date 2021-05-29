import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SuggestionList = (props: any) => {
    const {
        songs,
        navigation,
        suggestions
    } = props;

    if (suggestions && !suggestions.length) {
        return null;
    }

    return (
        <View
            style={{
                backgroundColor: '#fff',
                marginTop: -4,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#eee',
                flex: 1
            }}
        >
            {
                suggestions.map((suggestion: any, index: number) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                navigation.navigate('SearchSongScreen', {
                                    songs,
                                    searchedText: suggestion
                                });
                            }}
                        >
                            <Text
                                key={index}
                                style={{
                                    paddingBottom: 10,
                                    paddingLeft: 5,
                                    paddingTop: 5
                                }}
                            >
                                {suggestion}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            }
        </View>
    );
};

export default memo(SuggestionList);
