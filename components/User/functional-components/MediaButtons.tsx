import React from 'react';
import { Button } from './Button';

function hasSongOrGroupOwner(mediaUser: any, songUser: any, groupOwner: any) {
    return ((mediaUser && songUser.uid === mediaUser.uid) ||
        mediaUser.uid === groupOwner);
}

export const MediaButtons = (song: any, media: any, group: any, actions: string[]) => {
    const mediaMap = {
        votes: {
            containerStyle: { paddingRight: 2 },
            votes_count: song.votes_count,
            voted_users: song.voted_users,
            iconName: 'thumbs-up',
            iconType: 'entypo',
            iconColor: '#90c520',
            action: () => {
                media.emit('send-message-vote-up',
                    {
                        song,
                        chatRoom: group.group_name,
                        user_id: media.user.uid,
                        count: ++song.votes_count
                    });
            }
        },
        remove: {
            containerStyle: { paddingRight: 2, marginLeft: 10 },
            iconName: 'remove',
            iconType: 'font-awesome',
            iconColor: '#dd0031',
            action: () => {
                media.emit('send-message-remove-song',
                    {
                        song,
                        chatRoom: group.group_name,
                        user_id: media.user.uid
                    });
            },
            isOwner: hasSongOrGroupOwner(media.user, song.user, group.user_owner_id)
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
        default:
            throw new Error(`No action for ${getAction.name} in media buttons specified`);
        }
    }

    function createButton(action: string) {
        return {
            element: () => (
                <Button
                    containerStyle={getAction(action, 'containerStyle')}
                    disabled={getAction(action, 'disabled')}
                    text={getAction(action, 'text')}
                    iconName={getAction(action, 'iconName')}
                    iconType={getAction(action, 'iconType')}
                    iconColor={getAction(action, 'iconColor')}
                    action={getAction(action, 'action')}
                />
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
            }
        });

        return buildedButtons;
    }

    return buildActionButton();
};
