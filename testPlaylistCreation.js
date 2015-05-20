var Mopidy = require("mopidy");
var mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws",
  callingConvention: "by-position-only"
});

var init = function() {
  mopidy.playlists.create("Podcast Playlist", "http://www.npr.org/rss/podcast.php?id=510019").then(function(playlist) {
    // got my playlist object
    console.log(playlist.name);
    // get a library object to perform lookup of the podcast uri
    mopidy.library.lookup("http://www.npr.org/rss/podcast.php?id=510019").then(function(lookedUpTracks) {
      // set playlist.track to libraries tracks
      playlist.tracks = lookedUpTracks;
      return mopidy.playlists.save(playlist);
    }).then(function(savedPlaylist) {
      console.log("Added tracks for " + savedPlaylist.name);  
    });
  })
  .catch(console.error.bind(console))
  .done();
};

mopidy.on("state:online", init);