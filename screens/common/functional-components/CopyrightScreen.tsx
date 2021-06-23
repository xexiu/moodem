/* eslint-disable max-len */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import BodyContainer from '../../../components/common/functional-components/BodyContainer';
import { getCurrentYear } from '../../../src/js/Utils/common/date';

const year = getCurrentYear();

const CopyrightScreen = (props: any) => {
    const { navigation } = props;
    const isFocused = useIsFocused();

    useEffect(() => {
        navigation.setOptions({
            headerMode: 'none',
            unmountOnBlur: true,
            headerBackTitleVisible: false,
            unmountInactiveRoutes: true
        });
        return () => {

        };
    }, [isFocused]);

    return (
        <BodyContainer>
            <ScrollView>
                <View style={{ marginTop: 5, padding: 10 }}>
                    <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Copyright © {year} Moodem</Text>
                    <Text style={{ fontWeight: '600', alignSelf: 'center' }}>Todos los derechos reservados.</Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Cualquier forma no autorizada de distribución, copia, duplicación, reproducción, o venta (total o parcial) del contenido, tanto para uso personal como comercial, constituirá una infracción de los derechos de copyright y de sus respectivos autores.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Al acceder a esta app, confirmas estar familiarizado, comprender y aceptar totalmente el siguiente copyright y cláusula de derechos y exención de responsabilidades. De no ser así, debes abandonar esta app, por favor.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Cualquier tipo de reproducción total o parcial de su contenido está totalmente prohibida, a menos que se solicite una autorización expresa, y por escrito a sergiu.mironescu@gmail.com
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Los hechos, opiniones y puntos de vista que expresamos las personas de la app, son solamente nuestros, y no tienen por qué coincidir con la política, las ideas, intenciones, planes, estrategias, ni postura oficial de ningún organismo, empresa, compañía, organización, servicio, o persona.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Cuando utilicemos información procedente de fuentes externas para la elaboración de las entradas, dichas fuentes serán añadidas mediante un hipervínculo, o mencionadas de alguna manera para proporcionarles el reconocimiento que se merecen, lo que se hará igualmente con imágenes, etc. Nada en esta web será copiar y pegar de otra fuente, a menos que obtengamos su consentimiento. Si crees o sientes que estamos violando los derechos de autor de alguien, por favor dínoslo para remediarlo lo antes posible.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        El sistema de búsqueda de las canciones se realiza por la API de soundcloud.com, viniendo asi, toda la información necesaria de dicha canción. Digasé autor, tiempo de reproducción, visitas, etc.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        El sistema de chat utilizado en la app es un puente entre socket.io y nuestro código. Permitiendo así, el uso ligero entre servidor y cliente. Cualquier mejor o sugerencia estamos más que encantad@s en escucharla.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Todas las marcas o derechos de cualquier tipo, nombres registrados, logos o insignias, usados o citados en esta web, son propiedad de sus respectivos dueños. Esta web de ninguna forma aceptará responsabilidad alguna derivada de su infracción.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        Los comentarios de dichos chats, nombres de grupos o cualquier cosa ajena a la app, son responsabilidad única de las personas que los han escrito, éstas serán las únicas responsables de cualquier tipo de queja, daño o litigio que pudieran causar, bien de forma directa o indirecta. Respecto a los comentarios en los chats, no garantizamos la corrección, veracidad ni exactitud de dichos comentarios, así como tampoco si son rudos, políticamente correctos o en cualquier forma inapropiados, aunque haremos todo lo posible por evitarlo. Puedes corregirnos si lo crees oportuno, estar en desacuerdo con nosotros, o preguntarnos tus dudas, pero por favor mantén la compostura ya que nos reservamos el derecho de borrar y/o modificar cualquier comentario por cualquier razón que nos venga en mente (inapropiados, fuera de tono, obscenos, insultantes, ridículos, etc.) Por favor sé educado.
                    </Text>
                    <Text style={{ marginTop: 10, paddingBottom: 10 }}>
                        No tenemos control de la información a la que puedieras acceder a través de los enlaces externos que hay en nuestra app, en forma de vínculos o iconos en el propio texto, en la cabecera, pie de página, barras laterales, zona de comentarios, etc. No podemos garantizar la corrección, exactitud o validez de la información que proporcionan las webs/apps a las que dirigen dichos enlaces. No pertenecemos, trabajamos ni poseemos ninguna de ellas, ni ningún negocio que pudiera aparecer en ellas.
                    </Text>
                </View>
            </ScrollView>
        </BodyContainer>
    );
};

export default memo(CopyrightScreen);
