const Lyricist = require('lyricist/node6');
const lyricist = new Lyricist('wj4t6ZnMsotFYe9tCuXQT2JIhAi9QeNmkKDFUplMNoZBJRyZfRAWAYer9TBP3XPR');

//var Genius = require("node-genius");
//var geniusClient = new Genius('wj4t6ZnMsotFYe9tCuXQT2JIhAi9QeNmkKDFUplMNoZBJRyZfRAWAYer9TBP3XPR');

//var songID = results.id;

lyricist.search("lift yourself").then((song) => {
	//console.log(song);
  return song[0].id;
}).then((songId) => {
  lyricist.song(songId, {fetchLyrics: true}).then((song) => {
    console.log(song.lyrics);
  });
});