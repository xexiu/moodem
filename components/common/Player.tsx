/* eslint-disable max-len */
import React, { Component } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import Video from 'react-native-video';
import { SC_KEYS } from '../../src/js/Utils/constants/api/apiKeys';
import PreLoader from '../common/functional-components/PreLoader';
import { PlayerControlBackward } from '../common/PlayerControlBackward';
import { PlayerControlForward } from '../common/PlayerControlForward';
import { PlayerControlPlayPause } from '../common/PlayerControlPlayPause';
import { PlayerControlRepeat } from '../common/PlayerControlRepeat';
import { PlayerControlsContainer } from '../common/PlayerControlsContainer';
import { PlayerControlShuffle } from '../common/PlayerControlShuffle';
import { PlayerControlTimeSeek } from '../common/PlayerControlTimeSeek';
import { SongInfoAlbumCover } from '../common/SongInfoAlbumCover';
import { SongInfoArtist } from '../common/SongInfoArtist';
import { SongInfoContainer } from '../common/SongInfoContainer';
import { SongInfoTitle } from '../common/SongInfoTitle';

const Player = (props: any) => {

}

// function cleanImageParams(img: string) {
//     if (img.indexOf('hqdefault.jpg') >= 0) {
//         return img.replace(/(\?.*)/g, '');
//     }
//     return img;
// }

// function cleanTitle(title: string) {
//     return title && title.replace('VEVO', '') || '';
// }

// const errors = [] as string[];
// class Player extends Component {
//     public toastRef: any;
//     public tracks: any;
//     public state: any;
//     public setState: any;
//     public player: any;
//     public props: any;
//     public songAlbumCover: any;
//     public songTitle: any;
//     public songArtist: any;
//     public songIndex: any;
//     public currentSong: any;
//     public paused: any;
//     public shouldRepeat: any;
//     public shouldShuffle: any;
//     public trackCurrentTime: any;
//     public trackMaxDuration: any;
//     public songIsReady: any;

//     constructor(props: any) {
//         super(props);

//         console.log('CONSTRUCTOR');

//         this.toastRef = React.createRef();

//         props.tracks && props.tracks.length ?
//             this.tracks = props.tracks :
//             this.tracks = [];

//         this.state = {
//             loading: true,
//             key: SC_KEYS.key_1,
//             songAlbumCover: this.tracks.length ? cleanImageParams(this.tracks[0].videoDetails.thumbnails[0].url) : '',
//             songTitle: this.tracks.length ? this.tracks[0].videoDetails.title : '',
//             songArtist: this.tracks.length ? cleanTitle(this.tracks[0].videoDetails.author.name) : '',
//             songIndex: 0,
//             paused: true,
//             currentSong: this.tracks.length ? this.tracks[0].url : '',
//             isBuffering: true,
//             shouldRepeat: false,
//             shouldShuffle: false,
//             songIsReady: false,
//             trackCurrentTime: 0,
//             trackMaxDuration: this.tracks.length ? this.tracks[0].videoDetails.lengthSeconds : 0
//         };
//     }

//     componentDidMount() {
//         if (this.props.tracks && this.props.tracks.length) {
//             this.setState({
//                 isLoading: false
//             });
//         }
//     }

//     shouldComponentUpdate(prevProps: any, nextProps: any) {
//         if (prevProps.tracks &&
//             !!prevProps.tracks.length &&
//             !nextProps.isLoading &&
//             !nextProps.isBuffering) {
//             return true;
//         }

//         return false;
//     }

//     onPlayProgress = ({ currentTime }: any) => {
//         if (Math.round(currentTime) >= this.state.trackMaxDuration) {
//             console.log('STOOOPS', currentTime);
//             // const songEnded = setTimeout(() => {
//             //     !this.state.shouldRepeat && this.resetPlayLastSong(this.tracks, this.state.songIndex, this.state.shouldShuffle, this.state.shouldRepeat);

//             //     if (!this.state.shouldRepeat) {
//             //         this.setState({ trackCurrentTime: 0, paused: true });
//             //         this.player.seek(0);
//             //         clearTimeout(songEnded);
//             //         this.onPlayEnd(this.tracks, this.state.songIndex, this.state.shouldShuffle, this.state.shouldRepeat);
//             //     } else {
//             //         this.setState({ trackCurrentTime: 0, paused: true });
//             //         clearTimeout(songEnded);
//             //         this.onPlayEnd(this.tracks, this.state.songIndex, this.state.shouldShuffle, this.state.shouldRepeat);
//             //     }
//             // }, 100);
//         }
//         this.setState({
//             trackCurrentTime: currentTime
//         });
//     };

//     onPlayEnd = (tracks: any, songIndex: number, shouldShuffle: boolean, shouldRepeat: boolean) => {
//         if (shouldRepeat) {
//             this.dispatchActionsPressedTrack(tracks[songIndex], null);
//         } else if (shouldShuffle) {
//             const random = Math.floor((Math.random() * tracks.length) + 0);

//             if (tracks[random]) {
//                 this.dispatchActionsPressedTrack(tracks[random], null);
//             }
//         } else {
//             // next track
//             if (tracks[songIndex + 1]) {
//                 this.player.seek(0);
//                 this.dispatchActionsPressedTrack(tracks[songIndex + 1], null);
//             }
//         }
//     };

//     onBuffer = (buffer: any) => {
//         this.setState({ isBuffering: buffer.isBuffering, songIsReady: !buffer.isBuffering });
//     };

//     setKeyApi = (key: string) => {
//         if (this.state.key === SC_KEYS[key]) {
//             return this.setState({
//                 key: SC_KEYS[key]
//             });
//         }

//         return this.setState({
//             key: SC_KEYS[key]
//         });
//     };

//     onAudioError = ({ error }: any) => {
//         this.toastRef.current.show(`There was an error loading the Audio. ${error.code}`, 1000);
//     };

//     dispatchActionsPressedTrack = (track: any, cb: Function) => {
//         this.setState({
//             currentSong: track.url,
//             songAlbumCover: cleanImageParams(track.videoDetails.thumbnails[0].url),
//             songTitle: track.videoDetails.title,
//             songArtist: cleanTitle(track.videoDetails.author.name),
//             songIndex: track.index,
//             trackMaxDuration: Number(track.videoDetails.lengthSeconds),
//             paused: track.index === this.state.songIndex ? !this.state.paused : false
//         }, () => {
//             this.tracks.forEach((_track: any) => {
//                 if (track.index === _track.index) {
//                     Object.assign(track, {
//                         isPlaying: !this.state.paused,
//                         isCurrentSongPlaying: true
//                     });
//                     cb && cb(track);
//                 } else if (track.index !== _track.index && _track.isCurrentSongPlaying) {
//                     Object.assign(_track, {
//                         isPlaying: false,
//                         isCurrentSongPlaying: false
//                     });
//                     cb && cb(_track);
//                 }
//             });
//             this.setState({
//                 songAlbumCover: track.isPlaying ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6gzJoRwfiO7YqqZvyjXI9p_wuLtSMIBGUA&usqp=CAU' : cleanImageParams(track.videoDetails.thumbnails[1].url)
//             });

//             console.log('Tracks', this.tracks);
//         });
//     };

//     handleOnPressPlayPause = (paused: boolean) => {
//         this.setState({ paused: !paused });
//     };

//     handleOnPressForward = (tracks: any, songIndex: number) => {
//         if (tracks[songIndex + 1]) {
//             this.dispatchActionsPressedTrack(tracks[songIndex + 1], null);
//         }
//     };

//     handleOnPressBackward = (tracks: any, songIndex: number) => {
//         if (tracks.length > 1) {
//             this.setState({ trackCurrentTime: 0 });
//         }
//         if (tracks[songIndex - 1]) {
//             this.dispatchActionsPressedTrack(tracks[this.state.songIndex - 1], null);
//         }
//     };

//     hanleOnPressRepeat = () => {
//         this.setState({
//             shouldRepeat: !this.state.shouldRepeat
//         });
//     };

//     hanleOnPressShuffle = () => {
//         this.setState({
//             shouldShuffle: !this.state.shouldShuffle
//         });
//     };

//     handleOnTouchMoveSliderSeek = (time: any) => {
//         this.player.seek(time);
//     };

//     resetPlayLastSong = (tracks: any, songIndex: number, shouldShuffle: boolean, shouldRepeat: boolean) => {
//         let groupLength = tracks.length;

//         while (groupLength--) {
//             if (groupLength === 0) {
//                 this.setState({ trackCurrentTime: 0, songIndex: tracks.length, paused: true });
//                 this.player.seek(0);
//                 return this.onPlayEnd(tracks, songIndex, shouldShuffle, shouldRepeat);
//             }
//         }
//     };

//     render() {
//         const {
//             songAlbumCover,
//             songTitle,
//             songArtist,
//             songIndex,
//             currentSong,
//             paused,
//             shouldRepeat,
//             shouldShuffle,
//             trackCurrentTime,
//             trackMaxDuration,
//             songIsReady,
//             key,
//             isLoading
//         } = this.state;
//         const {
//             tracks,
//             children
//         } = this.props;

//         // console.log('Updated player');

//         if (isLoading) {
//             return (
//                 <View>
//                     <PreLoader
//                         containerStyle={{
//                             justifyContent: 'center',
//                             alignItems: 'center'
//                         }}
//                         size={50}
//                     />
//                 </View>
//             );
//         }

//         return (
//             <View style={{ flex: 1 }}>
//                 <Video
//                     source={{ uri: `${currentSong}?client_id=${key}` }}
//                     ref={ref => {
//                         this.player = ref;
//                     }}
//                     onExternalPlaybackChange={() => console.log('Checngeee')}
//                     volume={1.0}
//                     audioOnly
//                     muted={false}
//                     playInBackground
//                     playWhenInactive
//                     ignoreSilentSwitch={'ignore'}
//                     onBuffer={(buffer) => this.onBuffer(buffer)}
//                     onError={(error) => {
//                         console.log('Error', error);
//                         const keys = Object.keys(SC_KEYS);
//                         errors.push(error as any);

//                         for (const _key of errors) {
//                             if (keys.length < errors.length) {
//                                 return this.onAudioError(error);
//                             }
//                             this.setKeyApi(keys[errors.length]);
//                         }
//                     }}
//                     paused={paused}
//                     onLoad={({ duration }) => {
//                         this.setState({ trackCurrentTime: 0, isBuffering: false });
//                     }}
//                     onLoadStart={() => {
//                         this.tracks = tracks;
//                         this.setState({ trackCurrentTime: 0, isBuffering: false });
//                     }}
//                     onProgress={this.onPlayProgress}
//                     onEnd={() => console.log('end current song')}
//                     repeat={shouldRepeat}
//                 />

//                 <SongInfoContainer>
//                     <SongInfoAlbumCover songAlbumCover={songAlbumCover} />
//                     <SongInfoTitle songTitle={songTitle} />
//                     <SongInfoArtist songArtist={songArtist} />
//                 </SongInfoContainer>
//                 <PlayerControlsContainer>
//                     <PlayerControlShuffle
//                         shouldShuffle={shouldShuffle}
//                         onPressShuffle={() => {
//                             this.setState({
//                                 shouldRepeat: false
//                             });
//                             this.hanleOnPressShuffle();
//                         }}
//                     />
//                     <PlayerControlBackward
//                         onPressBackward={() => this.handleOnPressBackward(tracks, songIndex)}
//                     />
//                     <PlayerControlPlayPause
//                         paused={paused}
//                         onPressPlayPause={this.handleOnPressPlayPause}
//                         songIsReady={songIsReady}
//                     />
//                     <PlayerControlForward
//                         onPressForward={() => this.handleOnPressForward(tracks, songIndex)}
//                     />
//                     <PlayerControlRepeat
//                         shouldRepeat={shouldRepeat}
//                         onPressRepeat={() => {
//                             this.setState({
//                                 shouldShuffle: false
//                             });
//                             this.hanleOnPressRepeat();
//                         }}
//                     />
//                     <PlayerControlTimeSeek
//                         trackMaxDuration={trackMaxDuration}
//                         currentPosition={trackCurrentTime}
//                         songIsReady={songIsReady}
//                         onTouchMove={(time: any) => this.handleOnTouchMoveSliderSeek(time)}
//                     />
//                 </PlayerControlsContainer>
//                 {children}
//                 <Toast
//                     position='top'
//                     ref={this.toastRef}
//                 />
//             </View>
//         );
//     }
// }

// export { Player };
