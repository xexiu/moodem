import React, { memo, useEffect, useState } from 'react';
import { CommonFlatListItem } from '../../common/functional-components/CommonFlatListItem';
import { PreLoader } from '../../common/functional-components/PreLoader';
import { MediaButtons } from './MediaButtons';

const Song = (props: any) => {
    const {
        song,
        media,
        group,
        handler,
        player,
        isSearching,
        pressItemHandler
    } = props;
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        console.log('5. Song');
        setIsloading(false);
    }, []);

    const isPlayerPlaying = () => !player.current.state.paused;

    const setSource = () => {
        if (isPlayerPlaying() && song.isPlaying) {
            return {
                source: {
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6gzJoRwfiO7YqqZvyjXI9p_wuLtSMIBGUA&usqp=CAU'
                }
            };
        }
        return {
            source: { uri: song.artwork_url }
        };
    };

    function renderItem() {
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

    if (isLoading) {
        return (
            <PreLoader
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                size={50}
            />
        );
    }

    return renderItem();
};

memo(Song);

export { Song };
