const todo = require('./todo.js');

var loadfile = Object.keys(todo.loadFile());

beforeAll(() => {
    console.log('asd');
    todo.addUser("testemail@test.com", 1, "Emmett", "answer", "mom");
});

test('tests if a user is added to file', () => {
    var lastKey = loadfile[loadfile.length-1];
    
  	expect(todo.loadFile()[`${lastKey}`]).toEqual(expect.objectContaining({
        name: 	"Emmett"

  	}));


test('tests if the user account is unique', () => {
	console.log('second one')
    expect(todo.duplicateUsers()).toReturn(0)
});


test('tests if artist does not exist in Songkick database', () => {
	expect(todo.getConcerts()
});
