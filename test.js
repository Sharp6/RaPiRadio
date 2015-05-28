// MOPIDY =======================================================================================
// ==============================================================================================

// OPERATIONAL FUNCTIONALITY ======================================================================
var init = function() {
  bindButtons();
  loadPodcastPlaylist()
  .catch(console.error.bind(console))
  .done();
};

// This switches the mode from music to podcast
var switchState = function() {
  mopidy.playback.getState().then(function(state) {
    if(state === "playing") {
      mopidy.playback.pause();
    } else {
      mopidy.playback.play();
    }
  });
};

var switchMode = function() {
  if(mode === "podcast") {
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

var volumeUp = function() {
  mopidy.mixer.getVolume().then(function(volume) {
    if(volume > 95) {
      console.log("Volume is already maxed.");
    } else {
      mopidy.mixer.setVolume(volume + 5).then(function() {
        console.log("Increased volume to " + volume + ".");
      });
    }
  });
};

var volumeDown = function() {
  mopidy.mixer.getVolume().then(function(volume) {
    if(volume < 5) {
      console.log("Volume is already at minimal.");
    } else {
      mopidy.mixer.setVolume(volume - 5).then(function() {
        console.log("Decreased volume to " + volume + ".");
      });
    }
  });
};


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

// TEST FUNCTIONALITY =============================================================================
var listTracks = function() {
  mopidy.library.lookup("podcast+http://www.npr.org/rss/podcast.php?id=510019").then(function(lookedUpTracks) {
    console.log(lookedUpTracks[0].uri, "name: " + lookedUpTracks[0].name);    
  });
};

// This should return multiple podcasts
var listPodcasts = function() {
  mopidy.library.browse("podcast+https://gpodder.net/user/Sharp6/subscriptions/rss").then(function(lookedUpTracks) {
    console.log("ListPodcasts: " + lookedUpTracks.length);
  });
};

var enableSleepMode = function() {
  if(sleeper) {
    clearTimeout(sleeper);
  }
  sleeper = setTimeout(goToSleep, 5000);
  console.log("Sleepmode activated");
};

var goToSleep = function() {
  console.log("Nighty night!");
};

// GPIO =========================================================================================
// ==============================================================================================
// button is attaced to pin 17, led to 18
var GPIO    = require('onoff').Gpio;
//var led     = new GPIO(18, 'out');
var button1  = new GPIO(2, 'in', 'rising');
var button2  = new GPIO(3, 'in', 'rising');
var button3  = new GPIO(4, 'in', 'rising');


// CALLBACKS =======================================================================================
function bindButtons() {
  button1.watch(volumeUp);
  button2.watch(volumeDown);
  button3.watch(enableSleepMode);
}

//  APP START HERE =======================================================================================
// =======================================================================================================
// CONSTANTS
// sleep time, podcast playlist name, spotify playlist name

var mode = "podcast";
var sleeper;

var Mopidy = require("mopidy");
var mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws",
  callingConvention: "by-position-only"
});
mopidy.on("state:online", init);
