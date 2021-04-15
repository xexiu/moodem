import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import Button from './Button';

function hasSongOrGroupOwner(mediaUser: any, songUser: any, groupOwner: any) {
    return ((mediaUser && songUser.uid === mediaUser.uid) ||
        mediaUser.uid === groupOwner);
}

export const MediaButtons = (song: any, media: any, actions: string[]) => {
    const navigation = useNavigation();
    const mediaMap = {
        send_media: {
            containerStyle: {
                marginBottom: 10,
                marginRight: -10
            },
            iconName: 'arrow-right',
            iconType: 'AntDesign',
            iconColor: '#90c520',
            iconSize: 40,
            iconStyle: { alignSelf: 'flex-end', paddingBottom: 40, fontSize: 40 },
            iconReverse: false,
            action: async () => {
                Object.assign(song, {
                    isMediaOnList: true,
                    isPlaying: false
                });

                await media.emit('send-message-add-song', {
                    song,
                    chatRoom: media.group.group_name,
                    isAddingSong: true
                });
                navigation.navigate(media.group.group_name);
            }
        },
        votes: {
            containerStyle: {},
            votes_count: song.votes_count,
            voted_users: song.voted_users,
            iconName: 'thumbs-up',
            iconType: 'entypo',
            iconColor: '#90c520',
            iconSize: 9,
            action: async () => {
                const userHasVoted = song.voted_users.some((id: string) => id === media.user.uid);
                if (!userHasVoted) {
                    song.voted_users.push(media.user.uid);
                    song.votes_count = ++song.votes_count;
                }
                await media.emit('send-message-vote-up',
                    {
                        song,
                        chatRoom: media.group.group_name,
                        isVoting: true
                    });
            }
        },
        remove: {
            containerStyle: {},
            iconName: 'remove',
            iconType: 'font-awesome',
            iconColor: '#dd0031',
            iconSize: 9,
            action: async () => {
                Object.assign(song, {
                    isPlaying: false
                });
                await media.emit('send-message-remove-song',
                    {
                        song,
                        chatRoom: media.group.group_name,
                        user_id: media.user.uid,
                        isRemovingSong: true
                    });
            },
            isOwner: hasSongOrGroupOwner(media.user, song.user, media.group.user_owner_id)
        }
    } as any;

    function getAttrAction(action: string, attribute: string) {
        switch (attribute) {
        case 'containerStyle':
            return mediaMap[action].containerStyle;
        case 'disabled':
            return mediaMap[action].voted_users &&
                    mediaMap[action].voted_users.some((id: number) => id === media.user.uid);
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
                <View style={{ marginBottom: 5, position: 'relative' }}>
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

    return buildActionButton();
};
