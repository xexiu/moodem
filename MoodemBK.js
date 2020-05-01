import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AbortController from 'abort-controller';
import firebase from './src/js/Utils/Helpers/services/firebase';

export default function Moodem() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log('render Moodem()');
        const controller = new AbortController();

        firebase.auth().onAuthStateChanged((_user) => setUser(_user));

        return () => {
            controller.abort();
        };
    }, [user]);
    //const hasInternetConnection = checkConnection();

    console.log('User Moodem()', user);

    return (
    <View style={{ marginTop: 40 }}><Text>HI MOODEM: {user && user.displayName}</Text></View>
    );
}
