const todo = require('./todo.js');

beforeAll(() => {
    todo.addUser("lolK@kek.com", 1, "Emmett", "answer", "mom");
    todo.loadFile()["lolK@kek.com"].loggedin = "yes";
});

test('tests if a user is added to file', () => {
    var thing = Object.keys(todo.loadFile());
    var lastKey = thing[thing.length - 1];

    expect(todo.loadFile()[`${lastKey}`]).toEqual(expect.objectContaining({
        name: "Emmett"
    }));
});

test('tests if correct artist ID is returned when requesting an artist', () => {
    expect.assertions(1);
    return todo.getArtistID('Lil Uzi Vert', 'aFVE4X3HUdTMjVLm').then(data => {
        expect(data.id).toBe(8081893);
    });
});

describe('check if the usernames already existed in the database', () => {
	test('username already in database -> should return 0', () => {
		expect(todo.duplicateUsers("lolK@kek.com")).toEqual(0)
	});

	test('username not in database -> should return 1', () => {
		expect(todo.duplicateUsers("something@something.com")).toEqual(1)
	});
});

describe('check if the user has successfully logged in with correct username and password', () => {
	test('user logs in with correct username and password -> should return 1', () => {
		expect(todo.loginCheck("lolK@kek.com", 1)).toEqual(1)
	});

	test('user logs in with incorrect password -> should return 0', () => {
		expect(todo.loginCheck("lolK@kek.com", 2)).toEqual(0)
	})

	test('user logs in with incorrect email -> should return 0', () => {
		expect(todo.loginCheck("lolk@kek.com", 1)).toEqual(0)
	})

	test('user logs in with incorrect email and password -> should return 0', () => {
		expect(todo.loginCheck("lolk@kek.com", 2)).toEqual(0)
	})

});
