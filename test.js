// MOPIDY =======================================================================================
// ==============================================================================================

// OPERATIONAL FUNCTIONALITY ======================================================================
var init = function() {
  bindButtons();
  loadPodcastPlaylist();
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

// This loads the podcast playlist into the tracklist
var loadPodcastPlaylist = function() {
  mopidy.playlists.getPlaylists().then(function(allPlaylists) {
    //I've got all playlists
    var rapiRadioPlaylists = allPlaylists.filter(function(playlist) {
      if(playlist.name === "RaPiRadio") {
        return true;
      }
    });
    mopidy.tracklist.clear().then(function() {
      return mopidy.tracklist.add(rapiRadioPlaylists[0].tracks);
    })
    .then(function(addedTracks) {
      console.log("I just added " + addedTracks.length + " tracks of the podcast playlist to the tracklist.");
    });
  })
  .catch(console.error.bind(console))
  .done();
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
  button1.watch(switchState);
  button2.watch(skipTrack);
  //button3.watch(f3);
}

//  APP START HERE =======================================================================================
// =======================================================================================================
// Initiate mopidy
var Mopidy = require("mopidy");
var mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws",
  callingConvention: "by-position-only"
});
mopidy.on("state:online", init);
