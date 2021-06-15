import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { removeSongFromDB } from '../../../src/js/Utils/Helpers/actions/songs';
import Button from '../../User/functional-components/Button';
import { AppContext } from '../../User/store-context/AppContext';

const controller = new AbortController();

const RemoveSongIcon = (song: any) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    function isOwner() {
        return ((user && song.user.uid === user.uid) ||
            user.uid === group.group_user_owner_id);
    }

    useEffect(() => {
        if (song.voted_users && isLoading) {
            setIsLoading(false);
        }
    }, [song.voted_users]);

    async function emitRemoveSong() {
        await socket.emit('send-message-remove-song',
            {
                song,
                chatRoom: `GroupId_${group.group_id}_GroupName_${group.group_name}`,
                user_id: user.uid,
                isRemovingSong: true
            });
        socket.off('send-message-remove-song');
        controller.abort();
    }

    return isOwner() && !isServerError && {
        element: () => (
            <View style={{ marginBottom: -5, position: 'relative' }}>
                <Button
                    containerStyle={{}}
                    disabled={isLoading}
                    iconName={'remove'}
                    iconType={'font-awesome'}
                    iconColor={'#dd0031'}
                    iconSize={9}
                    action={async () => {
                        setIsLoading(true);

                        setIsLoading(true);
                        await emitRemoveSong();
                        await removeSongFromDB(song, user, group.group_name);
                    }}
                />
            </View>
        )
    };
};

export {
    RemoveSongIcon
};
