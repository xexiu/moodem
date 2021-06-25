import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const TabBar = (props: any) => {
    return (
        <View
            style={{
                marginLeft: 30,
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
                        style={{
                            borderWidth: 1,
                            borderRadius: 10,
                            marginLeft: 15,
                            backgroundColor: props.navigationState.index === i ? '#666' : '#fff',
                            borderColor: props.navigationState.index === i ? '#aaa' : '#eee'
                        }}
                        onPress={() => {
                            return props.jumpTo(route.key);
                        }}
                    >
                        <Text
                            style={{
                                padding: 5,
                                color: props.navigationState.index === i ? '#fff' : '#000'
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
