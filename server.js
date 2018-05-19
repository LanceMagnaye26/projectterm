const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const todo = require('./todo.js');
const Lyricist = require('lyricist/node6');
const lyricist = new Lyricist('wj4t6ZnMsotFYe9tCuXQT2JIhAi9QeNmkKDFUplMNoZBJRyZfRAWAYer9TBP3XPR');
 
var key = '88668b813557eb90cd2054ce6cd4c990';
var key2 = '4nuZkjXqOYPvMAIEtqyRhyaivjgtB76R';
var app = express();



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 


hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));
 
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

app.get('/venues', (request, response) => {
	response.render('map.hbs', {
		title: 'Maps'
	})
});

app.post('/venues', (request, response) => {
    todo.getArtistID(request.body.artist, 'aFVE4X3HUdTMjVLm').then((result) => {
        return todo.getConcerts(result.id, 'aFVE4X3HUdTMjVLm');
    }).then((result) => {
        response.render('map.hbs', {
            title: 'Maps',
            events: result,
            error: 0
        })
    }).catch((error) => {
        if (error == 1){
            response.render('map.hbs', {
                title: 'Artist Not Found',
                events: 'failure',
                error: 1
            })
        } else {
            response.render('map.hbs', {
                title: 'Concert Not Found',
                events: 'failure',
                error: 2
            })
        }

    })
});

app.get('/', (request, response) => {
	todo.logoutCheck();
	response.render('login.hbs', {
		title: 'Login page',
		signinCheck: 1
	})
});

app.post('/', (request, response) => {
	if (todo.loginCheck(request.body.userLogin, request.body.passLogin) == 1) {
		global.currUser = request.body.userLogin;
		global.currName = todo.getName(request.body.userLogin)
		response.render('mytracks.hbs', {
			title: 'Main page',
			name: currName
		})
	}else {
		response.render('login.hbs', {
			title:'Login page',
			signinCheck: 0
		});
	}
});

app.get('/lyrics', (request, response) => {
    response.render('lyrics.hbs', {
        title: 'Find Lyrics'
    })
});

app.post('/lyrics', (request, response) => {
    todo.searchForSong(request.body.title, request.body.artist, true).then((result) => {
        response.render('lyrics.hbs', {
            title: 'Lyrics',
            lyrics: result
        })
    })
});

app.get('/playlist', (request, response) => {
	playlistObj = {}
	playlistObj.playlist = todo.showPlaylist(currUser)
	playlistObj.title = 'My Playlist'
	playlistObj.name = currName
	response.render('playlist.hbs', playlistObj)
})

app.get('/signup', (request, response) => {
	response.render('signup.hbs', {
		title: 'Sign up'
	})
});


app.post('/mainpage', (request, response) => {
	todo.getTracks(request.body.track, key).then((result) => {
		trackList = {};
		if('Error' in result) {
			// result.search = 0
			result.name = currName;
			response.render('mytracks.hbs', result)
		} else{
			var amount = Object.keys(result).length
			var bigArr = [];
			for (var artist in result) {
				var smallObj = {}
				smallObj.songTitle = result[artist].songTitle
				smallObj.artist = artist
				smallObj.image = result[artist].img
				bigArr.push(smallObj)
			}
			trackList.playlist = bigArr;
			trackList.name = currName
			// console.log(trackList)
			response.render('mytracks.hbs', trackList)
		}
	}).catch((error) => {
		console.log('There was an error: ', error);
	});
})

app.post('/tracks', (request, response) => {
	todo.addPlaylist(request.body.songName, request.body.artistName, request.body.image)
})


app.post('/signup', (request, response) => {
	if(todo.duplicateUsers(request.body.userLogin)==1) {
		if(todo.passCheck(request.body.passLogin, request.body.passLogin2)==1) {
			if(todo.passCheck(request.body.userAnswer, request.body.userAnswer2)==1) {
				todo.addUser(request.body.userLogin, request.body.passLogin, request.body.userName, request.body.userQuestion, request.body.userAnswer);
				response.render('congratulations.hbs', {
					title: 'Congratulations'
				});
			}else {
				response.render('signup.hbs', {
				title: 'Signup page',
				signupCheck: 2
			});
			}
		}else {
			response.render('signup.hbs', {
				title: 'Signup page',
				signupCheck: 1
			});
		}
	}else {
		response.render('signup.hbs', {
			title: 'Signup page',	
			signupCheck: 0	
		});
	}
});

app.listen(port, () => {
	console.log('Server is up on the port 8080');
});