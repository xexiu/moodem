import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BgImage } from '../common/BgImage';
const { width } = Dimensions.get('window');

export class OfflineNotice extends Component {
    render() {
        return (
            <View>
                <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>No Internet Connection</Text>
                </View>
                <View style={{ marginTop: 30 }}>
                    <BgImage source={require('../../assets/images/logo_moodem.png')} />
                </View>
            </View>
        );
    }
}

const styles = {
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: 35
    },
    offlineText: {
        color: '#fff'
    }
}