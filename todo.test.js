const todo = require('./todo.js');

beforeAll(() => {
    todo.addUser("lolK@kek.com", 1, "Emmett", "answer", "mom");
});

afterAll(() => {
    todo.deleteUser("lolK@kek.com");
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