const todo = require('./todo.js');

beforeAll(() => {
    todo.addUser("lolK@kek.com", 1, "Emmett", "answer", "mom");
    todo.loadFile()["lolK@kek.com"].loggedin = "yes";
});

afterAll(() => {
    todo.deleteUser("lolK@kek.com");
});

test('tests if a user is added to file', () => {
    var thing = Object.keys(todo.loadFile());
    var lastKey = thing[thing.length-1];
    
  	expect(todo.loadFile()[`${lastKey}`]).toEqual(expect.objectContaining({
        name: 	"Emmett"

<<<<<<< HEAD
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

<<<<<<< HEAD
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

test('test if email is correctly being used as a key', () => {
   expect(todo.getName("lolK@kek.com")).toEqual(expect.stringContaining("Emmett"))
});

test('test if a track is searched', () => {
    expect.assertions(1);
    return todo.getTracks('Lucid Dream Juice', '88668b813557eb90cd2054ce6cd4c990').then(data => {
        console.log(data['Juice WRLD']);
        expect(data['Juice WRLD'].songTitle).toBe("Lucid Dream (Forget Me)");
    })
});
=======
  	}));


test('tests if artist does not exist in Songkick database', () => {
});
>>>>>>> cb5712cf5653fbf0e853e3986475473f25d243ae
