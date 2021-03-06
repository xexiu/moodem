/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

const About = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            title: 'Sobre Nosotros',
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ marginTop: 5, padding: 10 }}>
                    <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Moodem</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Somos una app destinada a la interacción de música entre nuestros usuario brindando un sistema de chat y compartir en modo real (live) las canciones que nuestro buscador (gracias a la API de soundcloud) ofrece a la hora de interactuar con el mismo.</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Todo o en gran parte de nuestro código está implementado en base a la arquitectura de react native (https://reactnative.dev/) y frameworks o dependencias externas, cuyo reponsabilidad se dirige a los mismos autores.</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Moodem está hecho sin ningún ánimo de lucro y en base a las preferencias y deseos de nuestro usuarios. En ningún momento los datos de los mismo usuarios serán o están usados como fines externos, beneficos o con maldad. La privacidad es nuestra primera prioridad, además de comprometernos a no guardar ningún historial de chats o música/canciones en nuestra base de datos.</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Todas las interacciones (digasé chats/cansiones) están procesadas en tiempo real con socket.io y ninguna base de datos actua como intermediaria.</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>La información guardada es la única que se procede al registrarse el usuario (nombre, email y contraseña). El nombre de los grupos creados y el flujo de las invitaciones y personas pertenecientes a dichos grupos serán guardadas con fines de improvisar la app y hacer un uso adecuado de la misma.</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Cualuquier sugerencia, mejora o queja, por favor, no dude en escribirnos a la dirección de e-mail: sergiu.mironescu@gmail.com</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Muchas gracias!</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default memo(About);
