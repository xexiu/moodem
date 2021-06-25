import { Alert } from 'react-native';
import { translate } from '../../../src/js/Utils/Helpers/actions/translationHelpers';

export const LeaveGroupIcon = (group: any, callback: Function) => {
    function handleUserLeaveGroup() {
        Alert.alert(
            `${translate('groups.settings.alert.2')} \n\n ${group.group_name} \n\n ${translate('groups.settings.alert.3')}`,
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
