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

                        const userHasVoted = song.voted_users.some((id: number) => id === user.uid);

                        if (!userHasVoted) {
                            if (song.voted_users.indexOf(user.uid) === -1) {
                                song.voted_users.push(user.uid);
                            }
                        }
                        const indexInArray = group.group_songs.findIndex((_song: any) => _song.id === song.id);

                        if (group.group_songs[indexInArray].id === song.id) {
                            Object.assign(group.group_songs[indexInArray], {
                                voted_users: song.voted_users
                            });
                        }
                        group.group_songs.sort((a: any, b: any) => {
                            if (!a.voted_users || !a.boosted_users) {
                                Object.assign(a, {
                                    voted_users: a.voted_users || [],
                                    boosted_users: a.boosted_users || []
                                });
                            }
                            if (!b.voted_users || b.boosted_users) {
                                Object.assign(b, {
                                    voted_users: b.voted_users || [],
                                    boosted_users: b.boosted_users || []
                                });
                            }
                            return b.voted_users.length - a.voted_users.length;
                        });
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
