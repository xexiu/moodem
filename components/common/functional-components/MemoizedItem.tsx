import React, { memo } from 'react';
import CommonFlatListItem from './CommonFlatListItem';
import { RemoveSongIcon } from './RemoveSongIcon';
import { SendSongIcon } from './SendSongIcon';
import { VoteSongIcon } from './VoteSongIcon';

// tslint:disable-next-line:max-line-length
const MemoizedItem = ({ index, item, handleOnClickItem, buttonActions = [], chevron = null, optionalCallback }: any) => {
    console.log('Render Item');

    const BUTTONGROUP_MAP = {
        votes: VoteSongIcon(item),
        remove: RemoveSongIcon(item)
    } as any;

    const CHEVRON_MAP = {
        send_media: SendSongIcon(item, optionalCallback)
    } as any;

    function setButtonGroupAction() {
        const actions = [] as any;

        buttonActions.map((action: string) => BUTTONGROUP_MAP[action] && actions.push(BUTTONGROUP_MAP[action]));

        return actions;
    }

    return (
        <CommonFlatListItem
            bottomDivider
            topDivider={true}
            title={item.details.title}
            titleProps={{ ellipsizeMode: 'tail', numberOfLines: 2 }}
            titleStyle={{ paddingBottom: 7 }}
            subTitleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
            subtitle={`${item.details.author.name.replace('VEVO', '')}`}
            subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic', width: 180 }}
            leftAvatar={{
                source: {
                    uri: item.details.thumbnails[0].url
                }
            }}
            chevron={!item.isMediaOnList && CHEVRON_MAP[chevron]}
            buttonGroup={setButtonGroupAction()}
            action={() => handleOnClickItem(index)}
        />
    );
};

export default memo(MemoizedItem);
