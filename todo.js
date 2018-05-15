const fs = require('fs');
const request = require('request');
const Lyricist = require('lyricist/node6');
const lyricist = new Lyricist('wj4t6ZnMsotFYe9tCuXQT2JIhAi9QeNmkKDFUplMNoZBJRyZfRAWAYer9TBP3XPR');

/**
 * This function loads the 'accounts.json' file
 * @author EventPlug
 * @version 2.0
 */
var loadFile = () => {
	try {
		return JSON.parse(fs.readFileSync('accounts.json'));
	}
	catch (exception) {
		if(exception.code === 'ENOENT') {
			fs.writeFileSync('accounts.json', '{}');
			return JSON.parse(fs.readFileSync('accounts.json'));
		}
	}
};

/**
 * This function checks if the account signing up is already contained in the file
 * @param {array} usersArr - List of users in the 'accounts.json' file
 * @param {string} username - The username that gets checked for duplicates
 */
var duplicateUsers = (usersArr, username) => {
	usersArr = loadFile();
	if (username in usersArr) {
		return 0
	}else {
		return 1
	}
};

/**
 * This function checks if the supplied account and password match
 * @param {array} usersArr - List of users in the 'accounts.json' file
 * @param {string} username - List of users in the 'accounts.json' file
 * @param {string} password - The username that gets checked for duplicates
 */
var loginCheck = (usersArr, username, password) => {
	usersArr = loadFile();
	if(username in usersArr) {
		if(password == usersArr[username].pass) {
			usersArr[username].loggedin = 'yes'
			writeFile(usersArr);
			return 1
		}else {
			return 0
		}
	}else {
		return 0
	}
}


/**
 * This function makes sure that the user has entered the password
 * @param {string} pass1 - The first password entered in the form
 * @param {string} pass2 - Supposed to be the same as the first pass
 */
var passCheck = (pass1, pass2) => {
	if(pass1 == pass2) {
		return 1
	}else {
		return 0
	}
};


/**
 * This function just creates the 'accounts.json' file
 * @param {array} usersArr - The list of accounts that will be written to the json
 */
var writeFile = (usersArr) => {
	fs.writeFileSync('accounts.json', JSON.stringify(usersArr));
};

/**
 * This function adds a user to the list
 * @param {array} userArr - The first password entered in the form
 * @param {string} pass2 - Supposed to be the same as the first pass
 */
var addUser = (username, password, name, question, answer) => {
	var usersArr = loadFile();
	usersArr[username] = {
		name: name,
		pass: password,
		playlist: [],
		question: question,
		answer: answer,
		loggedin: 'no'
	}
	writeFile(usersArr);
};

var deleteUser = (username) => {
	var usersArr = loadFile();
	if (username in usersArr) {
		delete usersArr[username];
	} else {
		return False;
	}
};

/**
 * This function connects to the lastfm API to get tracks based on the search term
 * @async
 * @param {string} trackName - Name of the track that you want to search
 * @param {string} key - API key
 * @requires request
 */
var getTracks = (trackName, key) => {
  return new Promise((resolve,reject) => {
    request({
      url: `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(trackName)}&api_key=${key}&format=json&limit=10`,
      json: true
    }, (error, response, body) => {
      if (error) {
      	reject('Cannot connect to LastFM API');
      	console.log(error);
      }else if (body.results['opensearch:totalResults'] == 0) {
      	resolve({
      		Error: 'Could not find song'
      	});
      }else {
      	var trackObject = {};
      	for (var i = 0; i < body.results.trackmatches.track.length; i++) {
      		trackObject[body.results.trackmatches.track[i].artist] = {
      			songTitle: body.results.trackmatches.track[i].name,
      			img: body.results.trackmatches.track[i].image[2]['#text']
      		}
      	}
        resolve(trackObject);
      } 
    });
  });
};

/**
 * This function connects to the SongKick API to find the name of the concert and url dates
 * @async
 * @param {string} is - The artist that is featured or a part of the concert that is being searched for
 * @param {string} key - API key
 * @requires request
 */

var getConcerts = (id, apiKey) => {
    return new Promise((resolve,reject) => {
        request({
            url: `http://api.songkick.com/api/3.0/artists/${id}/calendar.json?apikey=${apiKey}`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject('Cannot connect to Songkick API');
                console.log(error);
            }else if (body.resultsPage.totalEntries == 0) {
                resolve({
                    error : 'Concert not Found'
                });
            }else {
                var concertlist = [];
                var concertThing = {};
                var innerConcert = {};
                for (var i = 0; i < body.resultsPage.results.event.length; i++) {
                    concertThing['event' + i] = {
                        name: body.resultsPage.results.event[i].venue.displayName,
                        date: body.resultsPage.results.event[i].start.date,
                        city: body.resultsPage.results.event[i].location.city,
                        lat: body.resultsPage.results.event[i].location.lat,
                        lng: body.resultsPage.results.event[i].location.lng
                    };
                }
                resolve(concertThing);
                // resolve({
                //     uri: body.resultsPage.results.artist[0]['uri'],
                //     id: body.resultsPage.results.artist[0]['id']
                // });
            }
        });
    });
};

/**
 * This function gets the artist ID
 * @async
 * @param {string} artist - Name of the artist you want to search
 * @param {string} apiKey - API key
 * @requires request
 */
var getArtistID = (artist, apiKey) => {
    return new Promise((resolve,reject) => {
        request({
            url: `http://api.songkick.com/api/3.0/search/artists.json?apikey=${apiKey}&query=${encodeURIComponent(artist)}`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject('Cannot connect to Songkick API');
                console.log(error);
            }else if (body.resultsPage.results == undefined) {
                resolve({
                    error : 'Artist Not Found'
                });
            }else {
                resolve({
                    uri: body.resultsPage.results.artist[0]['uri'],
                    id: body.resultsPage.results.artist[0]['id']
                });
            }
        });
    });
};


/**
 * This function changes the loggedin value to "no" when you log out.
 * @param {array} usersArr - The array that contains all the registered users
 */
var logoutCheck = (usersArr) => {
	usersArr = loadFile();
	for (var user in Object.keys(usersArr)) {
		if(Object.values(usersArr)[user].loggedin == "yes") {
			Object.values(usersArr)[user].loggedin = "no";
		}
	}
	writeFile(usersArr);
}

/**
 * This function adds songs into a playlist contained in each users' property
 * @param {string} usersArr - The array that contains all the registered users
 * @param {string} song - Name of the song that will be added to your playlist
 */
var addPlaylist = (usersArr, song, artist, image) => {
	var checker = 1
	usersArr = loadFile();
	for (var user in Object.keys(usersArr)) {
		if(Object.values(usersArr)[user].loggedin == "yes") {
			if (Object.values(usersArr)[user].playlist.includes(song)) {
				checker = 0
			}else {
				var newObj = {song: {"artist":artist, "image":image}}
				Object.values(usersArr)[user].playlist.push(newObj);
			}
		}
	}
	writeFile(usersArr);
	return checker
};

var searchForSong = (songName, artistName="", fetchLyrics=false) => { // changed artistName to have a default of "", so we can do searchForSong(songName);
    return new Promise((resolve,reject) => {
        querySong(songName, artistName).then((song) => {
            if (song.id == 0) {
                reject("Cannot find song");
            }

            console.log("Song Name: " + song.title);
            console.log("Song ID: " + song.id);
            console.log("Song Artist:" + song.primary_artist.name);

            if (fetchLyrics) {
                lyricist.song(song.id, {fetchLyrics: true}).then((results) => {
                    resolve(results.lyrics);
                });
            }
        });
    })
};

/**
 * We can use these functions in another file now.
 * @type {{loadFile: loadFile, writeFile: writeFile, addUser: addUser, passCheck: passCheck, duplicateUsers: duplicateUsers, loginCheck: loginCheck, getTracks: (function(string, string): Promise<any>), logoutCheck: logoutCheck, addPlaylist: addPlaylist}}
 * @module exporting all the functions
 */
module.exports = {
    loadFile,
    writeFile,
    addUser,
    passCheck,
    duplicateUsers,
    loginCheck,
    getTracks,
    logoutCheck,
    addPlaylist,
    getTracks,
    getConcerts,
    getArtistID,
    searchForSong
};

//lyric program
var querySong = function(songName, artistName) {
  return new Promise(function(resolve, reject) {
    lyricist.search(songName).then((results) => { // results is the array of the returned search results
      results.some((song, index, _arr) => { // Loop through the idvidual songs
        if(artistName == "") { // if the aristName wasn't provided in searchForSong
          console.log("No artist provided."); // Choosing random top song");
          //var randIdx = getRndInteger(0, results.length);
          //console.log("Index %d chosen", randIdx);
          //resolve(results[randIdx]);
          //return true;
        } 
        else if (song.primary_artist.name.toLowerCase() == artistName.toLowerCase()) { // check if the artist contains your search term
          resolve(song);      
        }
    });
  });
});
};


 
// FORMAT FOR SEARCH: searchForSong("lift yourself", "kanye west", true);