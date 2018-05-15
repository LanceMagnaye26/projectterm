const todo = require('./todo.js');


test('tests if a user is added to file', () => {
  	expect(todo.addUser("lancem26", 1234, "Lance", "lol?", "kek")).toEqual(expect.objectContaining({
  		name: 	"Lance",
  		pass: 	1234
  	}));
});

