import React, { memo } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex: 1,
        justifyContent: 'center'
    },
    content: {
        marginHorizontal: 16
    },
    title: {
        fontSize: 48,
        fontWeight: '300',
        paddingBottom: 16
    },
    subtitle: {
        fontSize: 32,
        fontWeight: '800'
    },
    error: {
        paddingVertical: 16
    },
    button: {
        backgroundColor: '#2196f3',
        borderRadius: 50,
        padding: 16
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center'
    }
});

export type Props = { error: Error, resetError: Function };

const FallbackComponent = (props: Props) => {
    const {
        error,
        resetError
    } = props;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Oops!</Text>
                <Text style={styles.subtitle}>{'There\'s an error'}</Text>
                <Text style={styles.error}>{error.toString()}</Text>
                <TouchableOpacity style={styles.button} onPress={() => resetError()}>
                    <Text style={styles.buttonText}>Try again</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

memo(FallbackComponent);

export { FallbackComponent };
