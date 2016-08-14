module.exports = (function() {
	var Mopidy = require("mopidy");
	var mopidy;

	function init() {
		return new Promise(function(resolve,reject) {
			// MOPIDY INITIALIZATION
			mopidy = new Mopidy({
				webSocketUrl: "ws://localhost:6680/mopidy/ws",
				callingConvention: "by-position-only"
			});
			mopidy.on("state:online", function() {
				loadPodcastPlaylist()
					.then(resolve,reject);
			});
		});
	}

	var loadMusicPlaylist = function() {
		return mopidy.tracklist.clear()
			.then(function() {
				return mopidy.playlists.getPlaylists();
			})
			.then(function(allPlaylists) {
				return allPlaylists.filter(function(playlist) {
					return playlist.name === "Evening";
				})[0].tracks;
			})
			.then(function(tracks) {
				return mopidy.tracklist.add(tracks);
			})
			.then(function(addedTracks) {
				console.log("I just added " + addedTracks.length + " tracks of the music playlist to the tracklist.");
			});
	};

	var loadPodcastPlaylist = function() {
		return mopidy.tracklist.clear()
			.then(function() {
				return mopidy.playlists.getPlaylists();
			})
			.then(function(allPlaylists) {
				return allPlaylists.filter(function(playlist) {
					return playlist.name === "RaPiRadio";
				})[0].tracks;
			})
			.then(function(tracks) {
				return mopidy.tracklist.add(tracks);
			})
			.then(function(addedTracks) {
				console.log("I just added " + addedTracks.length + " tracks of the music playlist to the tracklist.");
			});
	};

	var notifyPlaylists = function() {
		return mopidy.playlists.getPlaylists()
			.then(function(playlists) {
				console.log("These are the playlists: ");
				playlists.forEach(function(playlist) {
					console.log("Playlist name: " + playlist.name);
				});
			});
	};

	var notifySong = function() {
		return mopidy.playback.getCurrentTrack()
			.then(function(track) {
				console.log("Now playing: ", track.name);
			});
	};

	var startPlaying = function() {
		return mopidy.playback.play()
			.then(function() {
				return notifySong();
			});
	};

	var skipTrack = function() {
		return mopidy.playback.next()
			.then(function(){
				return notifySong();
			});
	};

	// GETTER FUNCTIONALITY ===========================================================================
	var getTrackDescription = function(track) {
		return track.name + " by " + track.artists[0].name + " from " + track.album.name + ". URI: " + track.uri;
	};

	// PUBLIC FUNCTIONALITY ===========================================================================
	function switchState() {
		mopidy.playback.getState()
			.then(function(state) {
				if(state === "playing") {
					return mopidy.playback.pause();
				} else {
					return mopidy.playback.play();
				}
		});
	}

	function switchMode(currentMode) {
		var newMode;
		return Promise.resolve()
			.then(function () {
				if(currentMode === "podcast") {
					newMode = "music";
					return loadMusicPlaylist();
				} else {
					newMode = "podcast";
					return loadPodcastPlaylist();
				}
			})
			.then(function() {
				console.log("This should contain the new mode:", newMode);
				return newMode;
			});
	}

	function volumeUp() {
		return mopidy.mixer.getVolume()
			.then(function(volume) {
				if(volume > 95) {
					console.log("Volume is already maxed.");
					return Promise.resolve();
				} else {
					return mopidy.mixer.setVolume(volume + 5)
						.then(function() {
							console.log("Increased volume to " + volume + ".");
						});
				}
			});
	}

	function volumeDown() {
		return mopidy.mixer.getVolume()
			.then(function(volume) {
				if(volume < 5) {
					console.log("Volume is already at minimal.");
					return Promise.resolve();
				} else {
					return mopidy.mixer.setVolume(volume - 5)
						.then(function() {
							console.log("Decreased volume to " + volume + ".");
						});
				}
		});
	}

	function setVolume(newVolume) {
		return mopidy.mixer.getVolume()
			.then(function(volume) {
				var delta = Math.abs(volume - newVolume);
				if(delta > 10) {
					return mopidy.mixer.setVolume(newVolume)
						.then(function(settedVolume) {
							console.log("Volume has been set to " + settedVolume);
						});
				} else {
					console.log("Delta is too small. No volume change");
					return Promise.resolve();
				}
		});
	}

	return {
		init: init,
		switchState: switchState,
		switchMode: switchMode,
		volumeUp: volumeUp,
		volumeDown: volumeDown,
		skipTrack: skipTrack,
		setVolume: setVolume
	};

})();