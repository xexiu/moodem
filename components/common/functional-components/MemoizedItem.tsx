import React, { memo } from 'react';
import CommonFlatListItem from './CommonFlatListItem';
import { RemoveSongIcon } from './RemoveSongIcon';
import { SendSongIcon } from './SendSongIcon';
import { VoteSongIcon } from './VoteSongIcon';

const MemoizedItem = ({ chatRoom, index, item: song, handleOnClickItem, buttonActions = [], chevron = null }: any) => {
    console.log('Render Item');

    const BUTTONGROUP_MAP = {
        votes: VoteSongIcon,
        remove: RemoveSongIcon
    } as any;

    function setButtonGroupAction() {
        const actions = [] as any;

        buttonActions.map((action: string) => {
            BUTTONGROUP_MAP[action] && actions.push(BUTTONGROUP_MAP[action](song, chatRoom));
        });

        return actions;
    }

    return (
        <CommonFlatListItem
            bottomDivider
            topDivider={true}
            title={song.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            titleStyle={{ paddingBottom: 7 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${song.author.name.replace('VEVO', '')}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic', width: 180 }}
            leftAvatar={{
                source: {
                    uri: song.thumbnail
                }
            }}
            chevron={chevron ? SendSongIcon(song, chatRoom) : null}
            buttonGroup={setButtonGroupAction()}
            action={() => handleOnClickItem(index)}
        />
    );
};

export default memo(MemoizedItem);
