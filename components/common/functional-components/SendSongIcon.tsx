import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { saveSongOnDb } from '../../../src/js/Utils/Helpers/actions/songs';
import { AppContext } from '../../User/store-context/AppContext';

const controller = new AbortController();

const SendSongIcon = (song: any, chatRoom: string) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (song.voted_users && isLoading) {
            setIsLoading(false);
        }
        return () => {
            controller.abort();
        };
    }, [song.voted_users]);

    async function emitSendMedia() {
        await socket.emit('send-message-add-song', {
            song,
            chatRoom,
            isAddingSong: true
        });
        controller.abort();
    }

    return !isServerError && !song.isMediaOnList && {
        name: isLoading ? 'cloud-upload' : 'arrow-right',
        type: 'AntDesign',
        size: isLoading ? 25 : 45,
        color: isLoading ? '#999' : '#90c520',
        raised: false,
        disabled: isLoading,
        iconStyle: {
            margin: 0,
            padding: 0
        },
        containerStyle: {
            margin: 0,
            padding: 0
        },
        disabledStyle: {
            backgroundColor: 'transparent'
        },
        onPress: async () => {
            setIsLoading(true);

            Object.assign(song, {
                isMediaOnList: true,
                isPlaying: false,
                isSearching: false,
                voted_users: song.voted_users || [],
                boosted_users: song.boosted_users || []
            });

            group.group_songs.push(song);
            await emitSendMedia();
            await saveSongOnDb(song, user, group);
            navigation.navigate(group.group_name);
        }
    };
};

export {
    SendSongIcon
};
