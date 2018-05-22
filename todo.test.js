const todo = require('./todo.js');

beforeAll(() => {
    todo.addUser("lolK@kek.com", 1, "Emmett", "answer", "mom");
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
