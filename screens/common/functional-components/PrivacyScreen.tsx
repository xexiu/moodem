/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, {memo, useEffect} from 'react';
import { ScrollView, Text, View } from 'react-native';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';

const PrivacyScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            title: 'Privacidad',
            headerMode: 'none',
            unmountOnBlur: true,
            unmountInactiveRoutes: true,
            headerBackTitleVisible: false
        });
        return () => {

        };
    }, [isFocused]);
    return (
        <BodyContainer>
            <ScrollView>
                <View style={{ marginTop: 5, padding: 10 }}>
                    <Text style={{ marginBottom: 10 }}>Esta política se basa en nuestro objetivo fundamental de ofrecer a nuestros visitantes información y recursos de calidad y al mismo tiempo mantener el anonimato individual y la privacidad personal. La siguiente declaración describe la política de privacidad de la app (Moodem).</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Cookies</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>La app Moodem utiliza “cookies” un pequeño archivo de datos trasferido al disco duro de su móvil, para recopilar de manera anónima información sobre el tráfico de datos. Enviamos cookies cuando usted hace uso de la app, responde a encuestas o cuestionarios en línea, o solicita información. Aceptar cookies utilizados por nuestra app no nos permite acceder a su Información de Identificación Personal, pero podemos utilizar cookies para identificar su smart phone. La información colectiva recogida nos permite analizar modelos de tráfico en nuestro sitio. Esto nos ayuda a ofrecerle un mejor servicio al mejorar el contenido y hacer más fácil el uso de nuestra app.</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Datos del usuario</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>Cuando usted accede a nuestras app, la información sobre el usuario y la información técnica esencial y accidental es recopilada de manera automática, nos referimos a esas categorías recogidas de manera colectiva como  información de “acceso”. Ninguna otra información es recogida a través de la app, excepto cuando usted deliberadamente decide revelarla (por ejemplo, pulsando una tecla para enviarnos un mensaje de correo electrónico).</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Nuestro compromiso para la protección de los datos</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>La app Moodem no vende ninguna información de identificación personal ofrecida voluntariamente a terceras partes. Para prevenir el acceso no autorizado, mantener la exactitud de los datos, y garantizar el uso correcto de a información, hemos instaurado procedimientos físicos, electrónicos y administrativos para salvaguardar y proteger la información que recogemos en línea, de acuerdo con las políticas privacidad.</Text>
                    <Text>Si tiene otras preguntas o preocupaciones sobre nuestras políticas y prácticas de privacidad, por favor envíe un correo electrónico a sergiu.mironescu@gmail.com</Text>
                </View>
            </ScrollView>
        </BodyContainer>
    );
};

export default memo(PrivacyScreen);
