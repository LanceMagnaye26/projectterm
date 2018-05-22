const fs = require('fs');
const request = require('request');
const Lyricist = require('lyricist/node6');
const lyricist = new Lyricist('wj4t6ZnMsotFYe9tCuXQT2JIhAi9QeNmkKDFUplMNoZBJRyZfRAWAYer9TBP3XPR');

/**
 * This function loads the 'accounts.json' file - contains information on all the registered accounts
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
 * This function checks if the username is already contained in the database
 * @param {string} username - The username that gets checked for duplicates
 */
var duplicateUsers = (username) => {
	var usersArr = loadFile();
	if (username in usersArr) {
		return 0
	}else {
		return 1
	}
};

/**
 * This function checks if the provided account and password match in the database
 * @param {string} username - The username provided by the user to get checked
 * @param {string} password - The password provided by the user to get checked
 */
var loginCheck = (username, password) => {
  var usersArr = loadFile();
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
 * This function makes sure that the user has entered the password correctly when signing up
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
 * This function just writes to the 'accounts.json' file
 * @param {array} usersArr - The list of accounts that will be written to the json
 */
var writeFile = (usersArr) => {
	fs.writeFileSync('accounts.json', JSON.stringify(usersArr));
};

/**
 * This function adds a user to the database when they have completed the sign up process
 * @param {string} username - The username (or email) provided by the user
 * @param {string} password - The first password entered in the form
 * @param {string} name - The name of the user
 * @param {string} question - The security question chosen by the user during the sign up process
 * @param {string} answer - The answer to the security question from above
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

/**
 * This function deletes a user from the database
 * @param {string} email - The key entered to be deleted
 */
var deleteUser = (email) => {
	var usersArr = loadFile();
	if (email in usersArr) {
		delete usersArr[email];
		writeFile(usersArr);
	} else {
    return false;
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
      		url: `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(trackName)}&api_key=${key}&format=json&limit=100`,
      		json: true
    	}, (error, response, body) => {
      		if (error) {
      			reject('Cannot connect to LastFM API');
      			console.log(error);
      		}else if (Object.keys(body).length == 0) {
      			resolve({
      				Error: 'Could not find song'
      			});
      		}else if (body.results.trackmatches.track.length == 0) {
      			resolve({
      				Error: 'Could not find song'
      			});
      		}else {
      			var trackObject = {};
      			for (var i = 0; i < body.results.trackmatches.track.length; i++) {
      				if (body.results.trackmatches.track[i].image[2]['#text'] != '') {
      					var image = body.results.trackmatches.track[i].image[2]['#text']
      				}else {
      					var image = 'data:image/jpeg;base64,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'
      				}
  					trackObject[body.results.trackmatches.track[i].artist] = {
  						songTitle: body.results.trackmatches.track[i].name,
  						img: image
  					}
  				}
  				console.log(trackObject);
	        	resolve(trackObject);
      		} 
    	});
  	});
};


/**
 * This function connects to the songkick API to get the concerts' locations using the id of the artist obtained from getArtistID()
 * @async
 * @param {string} id - id of the artist
 * @param {string} key - API key
 * @requires request
 */
var getConcerts = (id, apiKey) => {
    return new Promise((resolve,reject) => {
        request({
            url: `http://api.songkick.com/api/3.0/artists/${id}/calendar.json?apikey=${apiKey}`,
            json: true
        }, (error, response, body) => {
            if (body.resultsPage.totalEntries != 0) {
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

            } else {
                reject('Concert Not Found');
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

            }else if (body.resultsPage.totalEntries == 0) {
                reject(1);

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
 */
var logoutCheck = () => {
	var usersArr = loadFile();
	for (var user in Object.keys(usersArr)) {
		if(Object.values(usersArr)[user].loggedin == "yes") {
			Object.values(usersArr)[user].loggedin = "no";
		}
	}
	writeFile(usersArr);
};

/**
 * This function adds songs into a playlist contained in each users' property
 * @param {string} song - Name of the song that will be added to your playlist
 * @param {string} artist - Name of the artist that will be added to your playlist
 * @param {string} image - The image source
 */
var addPlaylist = (song, artist, image) => {
	var checker = 1;
	var usersArr = loadFile();
	for (var user in usersArr) {
		if(usersArr[user].loggedin == "yes") {
			var newObj = {}
			newObj.song = song
			newObj.artist = artist
	 		newObj.image = image
	 		if (usersArr[user].playlist.length != 0) {
	 			for (var i = 0; i < usersArr[user].playlist.length; i++) {
	 				if (usersArr[user].playlist[i].song == song) {
						checker = 0
					}
	 			}
	 			if (checker == 1) {
	 				usersArr[user].playlist.push(newObj);
	 			}
	 		}else {
	 			usersArr[user].playlist.push(newObj);
	 		}
		}
	}
	writeFile(usersArr);
	return checker
};

/**
 * This function returns the lyrics of the song
 * @param {string} songName - Name of the song 
 * @param {string} artistName - Name of the artist
 */
var searchForSong = (songName, artistName="", fetchLyrics=false) => { // changed artistName to have a default of "", so we can do searchForSong(songName);
    return new Promise((resolve,reject) => {
        querySong(songName, artistName).then((song) => {
            if (song.id == 0) {
                reject("Cannot find song");
            }

            // console.log("Song Name: " + song.title);
            // console.log("Song ID: " + song.id);
            // console.log("Song Artist:" + song.primary_artist.name);

            if (fetchLyrics) {
                lyricist.song(song.id, {fetchLyrics: true}).then((results) => {
                    resolve(results.lyrics);
                });
            }
        });
    })
};

/**
 * This function takes in the username of the user and returns the name of the user
 * @param {string} email - The username of the user
 */
var getName = (email) => {
	var usersArr = loadFile();
	for (var user in usersArr) {
		if (usersArr[user].loggedin) {
			if (user == email) {
				return usersArr[user].name
			}
		}
	}
}

/**
 * This function takes in the username of the user and returns playlist of that user
 * @param {string} user - The username of the user
 */
var showPlaylist = (user) => {
	var usersArr = loadFile();
	return usersArr[user].playlist
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
    searchForSong, 
    getName, 
    showPlaylist,
	deleteUser
};

/**
 * This function takes in the song and the artist of the song to produce the song ID for searchForSong()
 * @param {string} songName - Name of the song the user wants to search up
 * @param {string} artistName - Name of the artist that makes the song
 */var querySong = function(songName, artistName) {
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
