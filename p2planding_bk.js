<View style={{ flex: 1, marginTop: 40, position: 'relative' }}>
                    {/* <View style={styles.container}>
                    <View style={styles.container}>
                        <Text>Token (_id): {this.props.token.slice(0, 6)}</Text>
                        <Text>Text: {this.state.text}</Text>
                    </View>
                </View>

                <View style={{ width: '100%', alignSelf: 'stretch', textAlign: 'center', backgroundColor: '#FDD7E4', justifyContent: 'center', flex: 6 }}>
                    <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} onChangeText={text => this.setState({ text })} value={this.state.text} />
                    <TouchableOpacity onPress={() => this.clickme()}>
                        <Text>Send Text</Text>
                    </TouchableOpacity>
                </View> */}

                    <SearchBar
                        clearIcon={clearIconState}
                        placeholder="Search song..."
                        onChangeText={this.updateSearch}
                        value={search}
                        onClear={this.clearSearchbar.bind(this)}
                        showLoading={showLoadingSpin}
                        onCancel={() => this.setState({ showLoadingSpin: false })}
                        onEndEditing={() => {
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
                        }}
                    />

                    <View style={{
                        borderLeftColor: '#eee',
                        borderLeftWidth: 1,
                        borderBottomLeftRadius: 20,
                        borderBottomColor: '#eee',
                        borderBottomWidth: 1,
                        borderRightColor: '#eee',
                        borderRightWidth: 1,
                        borderBottomRightRadius: 20,
                        marginRight: 10,
                        marginLeft: 10
                    }}>
                        <Text numberOfLines={1} style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 22,
                            marginTop: 10
                        }}>{songName}</Text>

                        <View style={[{
                            borderTopColor: '#eee',
                            borderTopWidth: 1,
                            marginTop: 5,
                            paddingBottom: 5,
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }]}>
                            <Icon
                                iconStyle={{ marginTop: 20, marginRight: 20 }}
                                Component={TouchableScale}
                                name='random'
                                type='font-awesome'
                                color='#444'
                                onPress={() => console.log('Pressed Shuffle Control Player')} />
                            <Icon
                                Component={TouchableScale}
                                raised
                                name='step-backward'
                                type='font-awesome'
                                color='#444'
                                onPress={() => console.log('Pressed Backward Control Player')} />
                            <Icon
                                Component={TouchableScale}
                                raised
                                name='play'
                                type='font-awesome'
                                color='#444'
                                onPress={() => console.log('Pressed Play Control Player - remeber to pause')} />
                            <Icon
                                Component={TouchableScale}
                                raised
                                name='step-forward'
                                type='font-awesome'
                                color='#444'
                                onPress={() => console.log('Pressed Forward Control Player')} />
                            <Icon iconStyle={{ marginTop: 20, marginLeft: 20 }}
                                Component={TouchableScale}
                                name='repeat'
                                type='font-awesome'
                                color='#444'
                                onPress={() => console.log('Pressed Forward Control Player')} />
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'red', flex: 1, position: 'relative' }}>
                        <FlatList style={{ border: 0, marginLeft: 10, marginRight: 10 }}
                            windowSize={12}
                            keyboardShouldPersistTaps="always"
                            data={this.state.searchedTracks}
                            renderItem={({ item }) => {
                                console.log('Item to render', item.name);
                                return (
                                    <ListItem
                                        bottomDivider
                                        Component={TouchableScale}
                                        title={item.name}
                                        onPress={() => {
                                            this.pressedItem.call(this, item.name, item.artists[0].name)
                                                .then((songName, artistName) => {
                                                    this.setState({
                                                        showListTracks: 1,
                                                        showListSearchedTracks: 0
                                                    })
                                                    console.log('Cliked from the list:', 'SongName: ', songName, 'ArtistName', artistName)
                                                    this.clickme(item.name, item.artists[0].name);
                                                });
                                        }}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    {/* <View style={{ backgroundColor: 'blue', flex: this.state.showListTracks, position: 'relative' }}>
                    <FlatList style={{ border: 0, marginLeft: 10, marginRight: 10 }}
                        keyboardShouldPersistTaps="always"
                        data={this.state.listTracks}
                        renderItem={({ item }) => {
                            console.log('Item from server', item);
                            return (
                                <ListItem
                                    bottomDivider
                                    Component={TouchableScale}
                                    title={`${item.song} - ${item.artist}`}
                                    titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                                    onPress={(track) => {
                                        console.log('You pressed track', track);
                                    }}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View> */}
                </View>