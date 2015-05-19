var Mopidy = require("mopidy");
var mopidy = new Mopidy({
  webSocketUrl: "ws://localhost:6680/mopidy/ws",
  callingConvention: "by-position-only"
});

var init = function() {
  mopidy.playlists.create("Podcast Playlist", "http://www.npr.org/rss/podcast.php?id=510019").then(function(playlist) {
    console.log(playlist.name);
  })
  .catch(console.error.bind(console))
  .done();
};

mopidy.on("state:online", init);
