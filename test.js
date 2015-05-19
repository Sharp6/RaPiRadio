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
  mopidy.tracklist.getLength().then(function(len){
    console.log(len);
  });
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
    skipTrack().then(function(){
      console.log("Track was skipped");
    })
    .catch(console.error.bind(console))
    .done();
  } else {
    // turn LED off
    led.writeSync(0);
  }
}

var init = function() {
  mopidy.tracklist.setRepeat(true).then(function(){
    console.log("Set repeat to true.");
  }).then(function(){
    return mopidy.playlists.create("GpodderCasts", "podcast://www.npr.org/rss/podcast.php?id=510019");
  })
/*
  }).then(function(playlist) {
    return mopidy.tracklist.add(playlist.tracks);
  }).then(function(tlTracks){
    return mopidy.playback.play(tlTracks[0]);
  }).then(function() {
    return notifySong();
  })
*/
  .then(function(playlist) {
    console.log(playlist.name);
  })
  .catch(console.error.bind(console))
  .done();
};

// pass the callback function to the
// as the first argument to watch()
button.watch(light);
mopidy.on("state:online", init);
