import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { loadFromLocalStorage, removeItem, saveOnLocalStorage } from '../../../src/js/Utils/common/storageConfig';
import {
    removeSongFromDB,
    removeSongFromLocalStorage,
    saveSongOnDb,
    saveSongOnLocalStorage,
    saveVotesForSongOnDb,
    saveVotesForSongOnLocalStorage
} from '../../../src/js/Utils/Helpers/actions/songs';
import { AppContext } from '../../User/store-context/AppContext';
import Button from './Button';

const controller = new AbortController();

export const MediaButtons = (song: any, actions: string[], optionalCallback: Function) => {
    const { isServerError, user, group, socket }: any = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    function hasSongOrGroupOwner(mediaUser: any, songUser: any, groupOwner: any) {
        return ((mediaUser && songUser.uid === mediaUser.uid) ||
            mediaUser.uid === groupOwner);
    }

    async function emitRemoveSong() {
        await socket.emit('send-message-remove-song',
            {
                song,
                chatRoom: group.group_name,
                user_id: user.uid,
                isRemovingSong: true
            });
        socket.off('send-message-remove-song');
        controller.abort();
    }

    async function emitSendMedia() {
        await socket.emit('send-message-add-song', {
            song,
            chatRoom: group.group_name,
            isAddingSong: true
        });

        socket.off('send-message-add-song');
        controller.abort();
    }

    async function emitVotedSong() {
        await socket.emit('send-message-vote-up',
            {
                song,
                chatRoom: group.group_name,
                user_id: user.uid
            });
        socket.off('send-message-vote-up');
        controller.abort();
    }

    const mediaMap = {
        send_media: {
            containerStyle: {
                marginBottom: 35,
                marginRight: -10
            },
            iconName: 'arrow-right',
            iconType: 'AntDesign',
            iconColor: '#90c520',
            iconSize: 40,
            iconStyle: { alignSelf: 'flex-end', paddingBottom: 40, fontSize: 40 },
            iconReverse: false,
            action: async () => {
                setIsLoading(true);

                Object.assign(song, {
                    isMediaOnList: true,
                    isPlaying: false,
                    isSearching: false,
                    voted_users: song.voted_users || [],
                    boosted_users: song.boosted_users || []
                });

                await saveSongOnLocalStorage(song, user, group.group_name);
                await saveSongOnDb(song, user, group.group_name, async () => {
                    setIsLoading(false);
                    await emitSendMedia();
                    return optionalCallback && optionalCallback();
                });
            }
        },
        votes: {
            containerStyle: {},
            votes_count: song.voted_users ? song.voted_users.length : 0,
            voted_users: song.voted_users,
            iconName: isLoading ? 'cloud' : 'thumbs-up',
            iconType: 'entypo',
            iconColor: '#90c520',
            iconSize: 9,
            action: async () => {
                setIsLoading(true);

                Object.assign(song, {
                    voted_users: song.voted_users || [],
                    boosted_users: song.boosted_users || []
                });
                await emitVotedSong();
                await saveVotesForSongOnLocalStorage(song, user, group.group_name);
                await saveVotesForSongOnDb(song, user, group.group_name, async () => {
                    setIsLoading(false);
                });
            }
        },
        remove: {
            containerStyle: {},
            iconName: isLoading ? 'cloud' : 'remove',
            iconType: 'font-awesome',
            iconColor: '#dd0031',
            iconSize: 9,
            action: async () => {
                setIsLoading(true);
                await removeSongFromLocalStorage(song, user, group.group_name);
                await removeSongFromDB(song, user, group.group_name, async () => {
                    setIsLoading(false);
                    await emitRemoveSong();
                });
            },
            isOwner: user && hasSongOrGroupOwner(user, song.user, group.user_owner_id)
        }
    } as any;

    function getAttrAction(action: string, attribute: string) {
        switch (attribute) {
        case 'containerStyle':
            return mediaMap[action].containerStyle;
        case 'disabled':
            return user && mediaMap[action].voted_users &&
                    mediaMap[action].voted_users.some((id: number) => id === user.uid) || isLoading;
        case 'text':
            return mediaMap[action].votes_count;
        case 'iconName':
            return mediaMap[action].iconName;
        case 'iconType':
            return mediaMap[action].iconType;
        case 'iconColor':
            return mediaMap[action].iconColor;
        case 'iconSize':
            return mediaMap[action].iconSize;
        case 'iconReverse':
            return mediaMap[action].iconReverse;
        case 'iconStyle':
            return mediaMap[action].iconStyle;
        case 'action':
            return mediaMap[action].action;
        default:
            throw new Error(`No attribute for ${getAction.name} in media buttons specified`);
        }
    }

    function getAction(action: string, attribute: string) {
        switch (action) {
        case 'votes':
            return getAttrAction(action, attribute);
        case 'remove':
            return getAttrAction(action, attribute);
        case 'send_media':
            return getAttrAction(action, attribute);
        default:
            throw new Error(`No action for ${getAction.name} in media buttons specified`);
        }
    }

    function createButton(action: string) {
        return {
            element: () => (
                <View style={{ marginBottom: -5, position: 'relative' }}>
                    <Button
                        containerStyle={getAction(action, 'containerStyle')}
                        disabled={getAction(action, 'disabled')}
                        text={getAction(action, 'text')}
                        iconName={getAction(action, 'iconName')}
                        iconType={getAction(action, 'iconType')}
                        iconColor={getAction(action, 'iconColor')}
                        iconStyle={getAction(action, 'iconStyle')}
                        iconSize={getAction(action, 'iconSize')}
                        iconReverse={getAction(action, 'iconReverse')}
                        action={getAction(action, 'action')}
                    />
                </View>
            )
        };
    }

    function buildActionButton() {
        const buildedButtons = [] as any;

        actions.forEach((action: string) => {
            switch (action) {
            case 'votes':
                buildedButtons.push(createButton(action));
                break;
            case 'remove':
                if (mediaMap[action].isOwner) {
                    buildedButtons.push(createButton(action));
                    break;
                }
            case 'send_media':
                if (!song.isMediaOnList) {
                    buildedButtons.push(createButton(action));
                    break;
                }
            }
        });

        return buildedButtons;
    }

    if (isServerError) {
        return null;
    }

    return buildActionButton();
};
