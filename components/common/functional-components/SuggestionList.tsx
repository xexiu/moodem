import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SuggestionList = (props: any) => {
    const {
        songsOnGroup,
        user,
        group,
        navigation,
        media,
        suggestions
    } = props;
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Effect SuggestionList');
        if (isFocused && suggestions.length) {
            setIsLoading(false);
        }

        return () => {
            setIsLoading(true);
        };
    }, []);

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
                                console.log('SuggestionList Player', player);
                                navigation.navigate('SearchingSongsScreen', {
                                    media,
                                    group,
                                    user,
                                    songsOnGroup,
                                    player
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
