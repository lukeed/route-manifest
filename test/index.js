const test = require('tape');
const parse = require('../dist/manifest');

test('exports', t => {
	t.is(typeof parse, 'function');
	t.end();
});

test('simple :: files only', t => {
	const data = {
		'/users/:name': ['b1', 'b2', 'b3'],
		'/': ['x1', 'x2', 'x3'],
		'/:slug': ['y1', 'y2', 'y3'],
		'*': ['*1', '*2', '*3'],
	};

	console.log('"/"');

	t.same(
		parse(data, '/'),
		{ files: data['/'], headers: [] },
		'~> returns its own files only'
	);

	t.same(
		parse(data, '/', true),
		{ files: [ ...data['*'], ...data['/'] ], headers: [] },
		'~> returns its own files, prefixed by "*" commons'
	);

	console.log('"/users/bob"');

	t.same(
		parse(data, '/users/bob'),
		{ files: data['/users/:name'], headers: [] },
		'~> returns its own files only'
	);

	t.same(
		parse(data, '/users/bob', true),
		{ files: [ ...data['*'], ...data['/users/:name'] ], headers: [] },
		'~> returns its own files, prefixed by "*" commons'
	);

	console.log('"/users"');

	t.same(
		parse(data, '/users'),
		{ files: data['/:slug'], headers: [] },
		'~> returns its own files only'
	);

	t.same(
		parse(data, '/users', true),
		{ files: [ ...data['*'], ...data['/:slug'] ], headers: [] },
		'~> returns its own files, prefixed by "*" commons'
	);

	console.log('"/does/not/exist"');

	t.same(
		parse(data, '/does/not/exist'),
		{ files: [], headers: [] },
		'~> returns empty contents'
	);

	t.same(
		parse(data, '/does/not/exist', true),
		{ files: data['*'], headers: [] },
		'~> returns "*" commons only'
	);

	t.end();
});
