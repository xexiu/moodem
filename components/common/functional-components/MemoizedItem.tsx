import React, { memo } from 'react';
import CommonFlatListItem from './CommonFlatListItem';
import { RemoveSongIcon } from './RemoveSongIcon';
import { SendSongIcon } from './SendSongIcon';
import { VoteSongIcon } from './VoteSongIcon';

const MemoizedItem = ({ index, item, handleOnClickItem, buttonActions = [], chevron = null }: any) => {
    console.log('Render Item');

    const BUTTONGROUP_MAP = {
        votes: VoteSongIcon,
        remove: RemoveSongIcon
    } as any;

    const CHEVRON_MAP = {
        send_media: SendSongIcon
    } as any;

    function setButtonGroupAction() {
        const actions = [] as any;

        buttonActions.map((action: string) => {
            BUTTONGROUP_MAP[action] && actions.push(BUTTONGROUP_MAP[action](item));
        });

        return actions;
    }

    function setChevron() {
        if (CHEVRON_MAP[chevron]) {
            return CHEVRON_MAP[chevron](item);
        }

        return null;
    }

    return (
        <CommonFlatListItem
            bottomDivider
            topDivider={true}
            title={item.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            titleStyle={{ paddingBottom: 7 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${item.details.author.name.replace('VEVO', '')}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic', width: 180 }}
            leftAvatar={{
                source: {
                    uri: item.thumbnail
                }
            }}
            chevron={setChevron()}
            buttonGroup={setButtonGroupAction()}
            action={() => handleOnClickItem(index)}
        />
    );
};

export default memo(MemoizedItem);
