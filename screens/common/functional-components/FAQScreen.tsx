/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

const FAQScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
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
                    <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>1. ¿Cómo usar Moodem?</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Se puede usar Moodem como chat general, chat por grupos, buscador de canciones y compartir las canciones en modo live con los grupos privados o el grupo general que la misma app brinda.</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>2. ¿Cómo buscar canciones?</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Utilizando nuestro buscador que la app ofrece (parte superior). Se puede votar cancaciones y eliminarlas si eres administrador de un grupo dónde la canción es compartida.</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>3. ¿Cómo unirse a los grupos?</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Abriendo el menú lateral -> Grupos -> Búscador de grupos en la parte superior -> Introducir contraseña del grupo al que quiere unirse.</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>4. ¿Cómo crear un grupo?</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Abriendo el menú lateral -> Grupos -> Crear Grupo</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>5. ¿Existe algún límite para buscar y compartir canciones?</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>El límite es indefinido siempre y cuando no hay un uso excesivo de ello y el tráfico no sobrepasa los límites de nuestros servidores. Sin mencionar los límites que la API de soudcloud puede penalizar a la hora de hacer muchas requests.</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'flex-start' }}>6. ¿Existe algún límite para crear grupos?</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>El límite es indefinido siempre y cuando no hay un uso excesivo de ello y el tráfico no sobrepasa los límites de nuestras base de datos.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default memo(FAQScreen);
