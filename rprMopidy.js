var rprMopidy = (function() {
  function init() {
    loadPodcastPlaylist()
      .catch(console.error.bind(console))
      .done();
  }

	var loadMusicPlaylist = function() {
	  return mopidy.playlists.getPlaylists().then(function(allPlaylists) {
	    //I've got all playlists
	    var rapiRadioPlaylists = allPlaylists.filter(function(playlist) {
	      if(playlist.name === "Evening") {
	        return true;
	      }
	    });
	    return mopidy.tracklist.clear().then(function() {
	      return mopidy.tracklist.add(rapiRadioPlaylists[0].tracks);
	    })
	    .then(function(addedTracks) {
	      console.log("I just added " + addedTracks.length + " tracks of the music playlist to the tracklist.");
	    });
	  });

	};

	// This loads the podcast playlist into the tracklist
	var loadPodcastPlaylist = function() {
	  return mopidy.playlists.getPlaylists().then(function(allPlaylists) {
	    //I've got all playlists
	    var rapiRadioPlaylists = allPlaylists.filter(function(playlist) {
	      if(playlist.name === "RaPiRadio") {
	        return true;
	      }
	    });
	    return mopidy.tracklist.clear().then(function() {
	      return mopidy.tracklist.add(rapiRadioPlaylists[0].tracks);
	    })
	    .then(function(addedTracks) {
	      console.log("I just added " + addedTracks.length + " tracks of the podcast playlist to the tracklist.");
	    });
	  });
	};

	var notifyPlaylists = function() {
	  mopidy.playlists.getPlaylists().then(function(playlists) {
	    console.log("These are the playlists: ");
	    for(var i = 0; i < playlists.length; i++) {
	      console.log("Playlist name: " + playlists[i].name);
	    }
	  })
	  .catch(console.error.bind(console))
	  .done();
	};

	var notifySong = function() {
	  return mopidy.playback.getCurrentTrack().then(function(track) {
	    console.log("Now playing: ", track.name);
	  });
	};

	var startPlaying = function() {
	  return mopidy.playback.play().then(function() {
	    return notifySong();  
	  });
	};

	var skipTrack = function() {
	  return mopidy.playback.next().then(function(){
	    return notifySong();
	  });
	};

	// GETTER FUNCTIONALITY ===========================================================================
	var getTrackDescription = function(track) {
	  return track.name + " by " + track.artists[0].name + " from " + track.album.name + ". URI: " + track.uri;
	};

  // PUBLIC FUNCTIONALITY ===========================================================================
  function switchState() {
	  mopidy.playback.getState().then(function(state) {
	    if(state === "playing") {
	      mopidy.playback.pause();
	    } else {
	      mopidy.playback.play();
	    }
	  });
	}

	function switchMode() {
	  if(mode === "podcast") {
	  	console.log("Got mode!");
	    loadMusicPlaylist()
	    .then(function() {
	      mode = "music";
	    })
	    .catch(console.error.bind(console))
	    .done();
	  } else {
	    loadPodcastPlaylist()
	    .then(function() {
	      mode = "podcast";
	    })
	    .catch(console.error.bind(console))
	    .done();
	  }
	}

	function volumeUp() {
	  mopidy.mixer.getVolume().then(function(volume) {
	    if(volume > 95) {
	      console.log("Volume is already maxed.");
	    } else {
	      mopidy.mixer.setVolume(volume + 5).then(function() {
	        console.log("Increased volume to " + volume + ".");
	      });
	    }
	  });
	}

	function volumeDown() {
	  mopidy.mixer.getVolume().then(function(volume) {
	    if(volume < 5) {
	      console.log("Volume is already at minimal.");
	    } else {
	      mopidy.mixer.setVolume(volume - 5).then(function() {
	        console.log("Decreased volume to " + volume + ".");
	      });
	    }
	  });
	}


  // MOPIDY INITIALIZATION
  var Mopidy = require("mopidy");
  var mopidy = new Mopidy({
    webSocketUrl: "ws://localhost:6680/mopidy/ws",
    callingConvention: "by-position-only"
  });
  mopidy.on("state:online", init);


  return {
  	switchState: switchState,
  	switchMode: switchMode,
  	volumeUp: volumeUp,
  	volumeDown: volumeDown,
  	skipTrack: skipTrack
  };

})();

