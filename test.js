// Initaite mopidy
var Mopidy = require("mopidy");
var mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws",
  callingConvention: "by-position-only"
});

var getTrackDescription = function(track) {
  return track.name + " by " + track.artists[0].name + " from " + track.album.name;
};

var printPlaylists = function() {
  mopidy.playlists.getPlaylists().then(function(playlists) {
    for(var i = 0; i < playlists.length; i++) {
      console.log(playlists[i].name);
    }
  })
  .catch(console.error.bind(console))
  .done();
};

var notifySong = function() {
  return mopidy.playback.getCurrentTrack().then(function(track) {
    console.log("Now playing: ", getTrackDescription(track));
  });
};

var loadPlaylist = function() {
  //printPlaylists();
  console.log(mopidy.tracklist.getState());
  /*
  mopidy.playlists.getPlaylists().then(function(playlists){
    var playlist = playlists[0];
    console.log("Loading playlist: ", playlist.name);
    return mopidy.tracklist.add(playlist.tracks).then(function(tlTracks) {
      return mopidy.playback.play(tlTracks[0]).then(notifySong);
    }); 
  })
  .catch(console.error.bind(console))
  .done();
*/
};

var skipTrack = function() {
  mopidy.playback.next().then(notifySong);
}


// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    led = new GPIO(18, 'out'),
    button = new GPIO(17, 'in', 'both');

// define the callback function
function light(err, state) {
  
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    led.writeSync(1);
    skipTrack();
  } else {
    // turn LED off
    led.writeSync(0);
  }
  
}

// pass the callback function to the
// as the first argument to watch()
button.watch(light);
mopidy.on("state:online", loadPlaylist);
