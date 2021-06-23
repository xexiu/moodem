export const SettingsGroupIcon = (group: any, navigation: any) => {
    return {
        name: 'settings',
        type: 'FontAwesome',
        color: '#1E90FF',
        raised: false,
        containerStyle: {
            marginBottom: 10
        },
        onPress: () => {
            return navigation.navigate('GroupSettingsScreen', {
                group
            });
        }
    };
};
