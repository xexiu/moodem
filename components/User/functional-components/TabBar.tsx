import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const TabBar = (props: any) => {
    return (
        <View
            style={{
                marginLeft: 17,
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10
            }}
        >
            {props.navigationState.routes.map((route: any, i: number) => {
                return (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            return props.jumpTo(route.key);
                        }}
                    >
                        <Text
                            style={{
                                marginLeft: 10,
                                borderWidth: 1,
                                padding: 5,
                                borderColor: props.navigationState.index === i ? '#aaa' : '#eee',
                                borderRadius: 10
                            }}
                        >
                            {route.title}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default memo(TabBar);
