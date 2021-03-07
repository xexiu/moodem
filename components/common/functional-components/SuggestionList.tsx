import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SuggestionList = (props: any) => {
    const {
        suggestions
    } = props;

    useEffect(() => {
        console.log('Effect SuggestionList');
    }, []);

    if (suggestions && !suggestions.length) {
        return null;
    }

    return (
        <View
            style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#eee',
                flex: 1,
                position: 'absolute',
                marginTop: 40,
                marginLeft: 50,
                right: 10,
                left: 0
            }}
        >
            {
                suggestions.map((suggestion: any, index: number) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => console.log('Pressed', suggestion)}>
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
