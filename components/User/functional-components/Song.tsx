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
        isSearching,
        isPlaying,
        pressItemHandler
    } = props;

    console.log('5. Song');

    const isPlayerPlaying = () => !player.current.state.paused;

    // isPlayerPaused -> false (song is playing)
    // song1 is playing -> false
    // song2 is playing -> true

    const setSource = () => {
        if (isPlayerPlaying() && song.isPlaying) {
            return {
                source: {
                    uri: require('../../assets/play_pause.png')
                }
            };
        }
        return {
            source: { uri: song.artwork_url }
        };
    };

    function renderItem() {
        // console.log('PAUSED', song.isPlaying);

        return (
            <CommonFlatListItem
                contentContainerStyle={{
                    position: 'relative',
                    paddingTop: 5,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
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
                leftAvatar={setSource()}
                buttonGroup={
                    isSearching ? [] :
                        MediaButtons(song, media, group, ['votes', 'remove'])
                }
                chevron={!song.isMediaOnList && {
                    name: 'arrow-right',
                    type: 'AntDesign',
                    color: '#dd0031',
                    onPress: () => handler(song),
                    size: 10,
                    raised: true,
                    iconStyle: { fontSize: 27, alignSelf: 'center' }
                }}
                action={() => {
                    player.current.dispatchActionsPressedTrack(song);
                    const isCurrentSongPlaying = new Promise(resolve => {
                        setTimeout(() => {
                            resolve(!player.current.state.paused);
                        }, 100);
                    });
                    isCurrentSongPlaying
                        .then(playing => {
                            return pressItemHandler(song, playing);
                        });
                }}
            />
        );
    }

    return renderItem();
};

memo(Song);

export { Song };
