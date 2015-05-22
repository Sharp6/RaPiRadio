// MOPIDY =======================================================================================

// Initaite mopidy
var Mopidy = require("mopidy");
var mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws",
  callingConvention: "by-position-only"
});

var getTrackDescription = function(track) {
  return track.name + " by " + track.artists[0].name + " from " + track.album.name + ". URI: " + track.uri;
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

var listTracks = function() {
  mopidy.library.lookup("podcast+http://www.npr.org/rss/podcast.php?id=510019").then(function(lookedUpTracks) {
    console.log(lookedUpTracks[0].uri, "name: " + lookedUpTracks[0].name);
    
  });

};

var init = function() {
  bindButtons();

  mopidy.tracklist.setRepeat(true).then(function(){
    console.log("Set repeat to true.");
  }).then(function(){
    return mopidy.playlists.create("My Podcasts", "podcast://www.npr.org/rss/podcast.php?id=510019");
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


// GPIO =======================================================================================
// button is attaced to pin 17, led to 18
var GPIO    = require('onoff').Gpio;
//var led     = new GPIO(18, 'out');
var button1  = new GPIO(2, 'in', 'both');
var button2  = new GPIO(3, 'in', 'both');
var button3  = new GPIO(4, 'in', 'both');


// CALLBACKS =======================================================================================
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

function f1(err, state) {
  if(state == 1) {
    console.log("Function 1.");
  }
}

function f2(err, state) {
  if(state == 1) {
    console.log("Function 2.");
  }
}

function f3(err, state) {
  if(state == 1) {
    console.log("Function 3.");
  }
}

function bindButtons() {
  button1.watch(listTracks);
  button2.watch(f2);
  button3.watch(f3);
}

// START HERE =======================================================================================
mopidy.on("state:online", init);
