import { useContext, useEffect, useState } from 'react';
import { saveSongOnDb } from '../../../src/js/Utils/Helpers/actions/songs';
import { AppContext } from '../../User/store-context/AppContext';

const controller = new AbortController();

const SendSongIcon = (song: any, optionalCallback: Function) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (song.voted_users && isLoading) {
            setIsLoading(false);
        }
    }, [song.voted_users]);

    async function emitSendMedia() {
        await socket.emit('send-message-add-song', {
            song,
            chatRoom: `GroupId_${group.group_id}_GroupName_${group.group_name}`,
            isAddingSong: true
        });

        socket.off('send-message-add-song');
        controller.abort();
    }

    return !isServerError && {
        name: 'arrow-right',
        type: 'AntDesign',
        size: 45,
        color: '#90c520',
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
            if (optionalCallback) {
                await optionalCallback();
                await emitSendMedia();
            } else {
                await emitSendMedia();
            }
            await saveSongOnDb(song, user, group.group_name);
        }
    };
};

export {
    SendSongIcon
};
