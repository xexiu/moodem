import React, { memo, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from '../../../components/User/functional-components/Button';
import { saveVotesForSongOnDb } from '../../../src/js/Utils/Helpers/actions/songs';
import { AppContext } from '../../User/store-context/AppContext';

const controller = new AbortController();

const VoteSongIcon = (song: any) => {
    const { user, group, socket, isServerError }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (song.voted_users && isLoading) {
            setIsLoading(false);
        }
    }, [song.voted_users]);

    function disableFn() {
        return !!(user && song.voted_users && song.voted_users.some((id: number) => id === user.uid)) ||
        isLoading;
    }

    async function emitVotedSong() {
        await socket.emit('send-message-vote-up',
            {
                song,
                chatRoom: `GroupId_${group.group_id}_GroupName_${group.group_name}`,
                user_id: user.uid
            });
        socket.off('send-message-vote-up');
        controller.abort();
    }

    return !isServerError && {
        element: () => (
            <View style={{ marginBottom: -5, position: 'relative' }}>
                <Button
                    containerStyle={{}}
                    disabled={disableFn()}
                    text={song.voted_users ? song.voted_users.length : 0}
                    iconName={'thumbs-up'}
                    iconType={'entypo'}
                    iconColor={'#90c520'}
                    iconSize={9}
                    action={async () => {
                        setIsLoading(true);

                        Object.assign(song, {
                            voted_users: song.voted_users || [],
                            boosted_users: song.boosted_users || []
                        });
                        await emitVotedSong();
                        await saveVotesForSongOnDb(song, user, group.group_name);
                    }}
                />
            </View>
        )
    };
};

export {
    VoteSongIcon
};
