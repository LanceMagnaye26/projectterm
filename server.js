const express = require('express');
const request = require('request');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const todo = require('./todo.js');

var key = '88668b813557eb90cd2054ce6cd4c990';
var key2 = "4nuZkjXqOYPvMAIEtqyRhyaivjgtB76R"
var app = express();

// var trackList = {};

var accounts = {};

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 


hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
})

app.get('/', (request, response) => {
	todo.logoutCheck(accounts);
	response.render('login.hbs', {
		title: 'Login page',
		signinCheck: 1
	})
});

app.post('/', (request, response) => {
	if ( todo.loginCheck(accounts, request.body.userLogin, request.body.passLogin) == 1) {
		response.render('mainpage.hbs', {
			title: 'Main page',
		})
	}else {
		response.render('login.hbs', {
			title:'Login page',
			signinCheck: 0
		});
	}
});

app.get('/playlist', (request, response) => {
	response.render('playlist.hbs', {
		title: 'My Playlist'
	})
})


app.get('/signup', (request, response) => {
	response.render('signup.hbs', {
		title: 'Sign up'
	})
});

app.get('/mainpage', (request, response) => {
	response.render('mainpage.hbs', {
		title: 'Track added!'
	})
});

app.post('/mainpage', (request, response) => {
	todo.getTracks(request.body.track, key).then((result) => {
		trackList = {};
		if('Error' in result) {
			response.render('mainpage.hbs', result)
		} else{
			for (var i in Object.keys(result)) {
				trackList[`songTitle${i}`] = Object.values(result)[i].songTitle
				trackList[`artist${i}`] = Object.keys(result)[i]
				trackList[`img${i}`] = Object.values(result)[i].img
			}
			response.render('mytracks.hbs', trackList)
		}
	}).catch((error) => {
		console.log('There was an error: ', error);
	});
})

app.post('/tracks', (request, response) => {
	todo.addPlaylist(accounts, request.body.songName, request.body.artistName, request.body.imageName)
})


app.post('/signup', (request, response) => {
	if(todo.duplicateUsers(accounts,request.body.emailAddr)==1) {
		if(todo.passCheck(request.body.password1, request.body.password2)==1) {
			console.log('yo')
			todo.addUser(accounts, request.body.emailAddr, request.body.password1);
			response.render('congratulations.hbs', {
				title: 'Congratulations'
			});
		}else {
			console.log('pass')
			response.render('signup.hbs', {
				title: 'Signup page',
				signupCheck: 1
			});
		}
	}else {
		console.log('dup')
		response.render('signup.hbs', {
			title: 'Signup page',
			signupCheck: 0	
		});
	}
});

app.listen(port, () => {
	console.log('Server is up on the port 8080');
});