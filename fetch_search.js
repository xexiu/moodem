
                            console.log('You Pressed Search');
                            this.setState({
                                showLoadingSpin: true,
                                showListTracks: 0,
                                clearIconState: true
                            });

                            debugger;

                            const headers = { "Authorization": "Bearer " + token };
                            fetch(`https://api.spotify.com/v1/search?q=${search}&type=track,playlist&limit=20`, {
                                headers
                            })
                                .then(resp => {
                                    debugger;
                                    return resp.json();
                                })
                                .then(data => {
                                    debugger;
                                    const tracks = data.tracks;

                                    if (tracks) {
                                        this.setState({
                                            searchedTracks: tracks.items
                                        });
                                    }
                                    this.setState({
                                        showLoadingSpin: false
                                    });

                                    if (data.error.status === 401 && data.error.message === 'The access token expired') {
                                        spotifyApi.getTokenWithRefreshedToken('/api/token', refreshToken, (_data) => {
                                            debugger;
                                            clearStorage(() => {
                                                setStorage('spotifyAuth', {
                                                    access_token: data.access_token,
                                                    token_type: data.token_type,
                                                    refresh_token: data.refresh_token
                                                });
                                            });
                                            debugger;
                                            spotifyApi.setAccessToken(data.access_token);
                                            spotifyApi.setTokenType(data.token_type);
                                            spotifyApi.setRefreshToken(data.refresh_token);

                                            const headers = { "Authorization": "Bearer " + data.access_token };
                                            fetch(`https://api.spotify.com/v1/search?q=${search}&type=track,playlist&limit=20`, {
                                                headers
                                            })
                                                .then(resp => {
                                                    debugger;
                                                    return resp.json();
                                                })
                                                .then(data => {
                                                    debugger;
                                                });
                                        });
                                    }
                                })
                                .catch(err => {
                                    debugger;
                                    this.setState({
                                        showLoadingSpin: false
                                    });
                                });
                        }