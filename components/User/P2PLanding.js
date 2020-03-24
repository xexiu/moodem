import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
/* eslint-disable class-methods-use-this */

// check local storage
    // if token exists then set state with token
    // else set token to null

    // debugger;
    // const headers = { "Authorization": "Bearer " + data.access_token };
    //     fetch('https://api.spotify.com/v1/search?q=calladita&type=track,playlist&limit=10', {
    //       headers
    //     })
    //       .then(resp => {
    //         debugger;
    //         return resp.json();
    //       })
    //       .then(data => {
    //         debugger;
    //       });

export class P2PLanding extends Component {
    render() {
        return (
            <View style={styles.container}><Text>HAS Access Token! Here goes the Componet P2PLanding</Text></View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});