import { Alert } from 'react-native';

export const LeaveGroupIcon = (group: any, callback: Function) => {
    function handleUserLeaveGroup() {
        Alert.alert(
            `Estás segur@ de que quieres abandonar el grupo: \n\n ${group.group_name} \n\n ¡Se perderán todos los datos relacionados con este grupo!`,
            undefined,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK', onPress: async () => {
                        return callback && callback();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return {
        name: 'logout',
        type: 'AntDesign',
        color: '#1E90FF',
        raised: false,
        containerStyle: {
            marginBottom: 10
        },
        onPress: () => {
            return handleUserLeaveGroup();
        }
    };
};
