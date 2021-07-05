import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Button from '../../../components/User/functional-components/Button';
import { saveVotesForSongOnDb } from '../../../src/js/Utils/Helpers/actions/songs';
import { AppContext } from '../../User/store-context/AppContext';

const controller = new AbortController();

const format = (n: number) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

const VoteSongIcon = (song: any, chatRoom: string) => {
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
                chatRoom,
                user_id: user.uid
            });
        controller.abort();
    }

    return !isServerError && {
        element: () => (
            <View style={{ marginBottom: -5, position: 'relative' }}>
                <Button
                    containerStyle={{}}
                    disabled={disableFn()}
                    text={format(song.voted_users ? song.voted_users.length : 0)}
                    iconName={'thumbs-up'}
                    iconType={'entypo'}
                    iconColor={'#90c520'}
                    iconSize={9}
                    action={async () => {
                        Object.assign(song, {
                            voted_users: song.voted_users || [],
                            boosted_users: song.boosted_users || []
                        });
                        const userHasVotedSong = song.voted_users.some((id: number) => id === user.uid);

                        if (!userHasVotedSong) {
                            if (song.voted_users.indexOf(user.uid) === -1) {
                                song.voted_users.push(user.uid);
                            }
                        }

                        setIsLoading(true);
                        await emitVotedSong();
                        await saveVotesForSongOnDb(song, user, group);
                    }}
                />
            </View>
        )
    };
};

export {
    VoteSongIcon
};
