const todo = require('./todo.js');

beforeAll(() => {
    todo.addUser("emmett@gmail.com", 1, "Emmett", "answer", "mom");
    todo.loadFile()["emmett@gmail.com"].loggedin = "yes";
});

afterAll(() => {
    todo.deleteUser("emmett@gmail.com");
});

test('tests if a user is added to file', () => {
    var thing = Object.keys(todo.loadFile());
    var lastKey = thing[thing.length-1];

    expect(todo.loadFile()[`${lastKey}`]).toEqual(expect.objectContaining({
        name: 	"Emmett"
    }));

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

test('tests if the confirm password input by user is the same as the first password', () => {
    expect(todo.passCheck(1,1)).toEqual(1)
});

// test('tests if the user has been deleted from the database', () => {
// 	expect(todo.deleteUser("",1)).toEqual(1)
// });

describe('check if the usernames already existed in the database', () => {
    test('username already in database -> should return 0', () => {
        expect(todo.duplicateUsers("emmett@gmail.com")).toEqual(0)
    });

    test('username not in database -> should return 1', () => {
        expect(todo.duplicateUsers("something@something.com")).toEqual(1)
    });
});

describe('check if the user has successfully logged in with correct username and password', () => {
    test('user logs in with correct username and password -> should return 1', () => {
        expect(todo.loginCheck("emmett@gmail.com", 1)).toEqual(1)
    });

    test('user logs in with incorrect password -> should return 0', () => {
        expect(todo.loginCheck("emmett@gmail.com", 2)).toEqual(0)
    })

    test('user logs in with incorrect email -> should return 0', () => {
        expect(todo.loginCheck("emmett1@gmail.com", 1)).toEqual(0)
    })

    test('user logs in with incorrect email and password -> should return 0', () => {
        expect(todo.loginCheck("emmett1@gmail.com", 2)).toEqual(0)
    })
});

test('test if email is correctly being used as a key', () => {
    expect(todo.getName("emmett@gmail.com")).toEqual(expect.stringContaining("Emmett"))
});

test('test if a track is searched', () => {
    expect.assertions(1);
    return todo.getTracks('Lucid Dream Juice', '88668b813557eb90cd2054ce6cd4c990').then(data => {
        expect(data['Juice WRLD'].songTitle).toBe("Lucid Dream (Forget Me)");
    })

});



test('tests querySong', () => {
    expect.assertions(1);
    return todo.querySong('Lift Yourself', 'Kanye West').then(data =>{
        expect(data.id).not.toBe(0);
    })

})

test('tests searchForSong', () => {
    expect.assertions(1);
    return todo.searchForSong('Lift Yourself', 'Kanye West').then(data =>{
        expect(data).not.toBeNull();
    })

});



