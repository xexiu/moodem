import React, { memo } from 'react';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        song,
        media,
        group,
        handler,
        player,
        isSearching
    } = props;

    console.log('5. Song');

    function renderItem() {
        return (
            <CommonFlatListItem
                contentContainerStyle={{
                    position: 'relative',
                    paddingTop: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
                    paddingBottom: 20,
                    paddingLeft: 10,
                    paddingRight: 0,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 1
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2
                }}
                bottomDivider
                title={song.title}
                titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                subtitle={song.user && song.user.username}
                subtitleStyle={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}
                leftAvatar={{
                    source: { uri: song.artwork_url }
                }}
                buttonGroup={isSearching ? [] : MediaButtons(song, media, group, ['votes', 'remove'])}
                chevron={!song.isMediaOnList && {
                    name: 'arrow-right',
                    type: 'AntDesign',
                    color: '#dd0031',
                    onPress: () => handler(song),
                    size: 10,
                    raised: true,
                    iconStyle: { fontSize: 27, alignSelf: 'center' },
                    containerStyle: { marginLeft: 0 }
                }}
                action={() => {
                    return player.current.dispatchActionsPressedTrack(song);
                }}
            />
        );
    }

    return renderItem();
};

memo(Song);

export { Song };
