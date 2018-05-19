const todo = require('./todo.js');

beforeAll(() => {
    console.log('asd');
    todo.addUser("dickmuncher@fortnite.com", 1, "Emmett", "answer", "mom");
});

test('tests if a user is added to file', () => {
    var thing = Object.keys(todo.loadFile());
    var lastKey = thing[thing.length-1];
    
  	expect(todo.loadFile()[`${lastKey}`]).toEqual(expect.objectContaining({
        name: 	"Emmett"

  	}));


test('tests if artist does not exist in Songkick database', () => {
});