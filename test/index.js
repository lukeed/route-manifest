const test = require('tape');
const parse = require('../dist/manifest');

test('exports', t => {
	t.is(typeof parse, 'function');
	t.end();
});


test('usage :: files only', t => {
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


test('usage :: files key', t => {
	const data = {
		'/users/:name': {
			"files": ['b1', 'b2', 'b3'],
		},
		'/': {
			"files": ['x1', 'x2', 'x3'],
		},
		'/:slug': {
			"files": ['y1', 'y2', 'y3'],
		},
		'*': {
			"files": ['*1', '*2', '*3'],
		},
	};

	console.log('"/"');

	t.same(
		parse(data, '/'),
		{ files: data['/'].files, headers: [] },
		'~> returns its own files only'
	);

	t.same(
		parse(data, '/', true),
		{ files: [ ...data['*'].files, ...data['/'].files ], headers: [] },
		'~> returns its own files, prefixed by "*" commons'
	);

	console.log('"/users/bob"');

	t.same(
		parse(data, '/users/bob'),
		{ files: data['/users/:name'].files, headers: [] },
		'~> returns its own files only'
	);

	t.same(
		parse(data, '/users/bob', true),
		{ files: [ ...data['*'].files, ...data['/users/:name'].files ], headers: [] },
		'~> returns its own files, prefixed by "*" commons'
	);

	console.log('"/users"');

	t.same(
		parse(data, '/users'),
		{ files: data['/:slug'].files, headers: [] },
		'~> returns its own files only'
	);

	t.same(
		parse(data, '/users', true),
		{ files: [ ...data['*'].files, ...data['/:slug'].files ], headers: [] },
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
		{ files: data['*'].files, headers: [] },
		'~> returns "*" commons only'
	);

	t.end();
});


test('usage :: files w/ headers', t => {
	const data = {
		'/users/:name': {
			"files": ['b1', 'b2', 'b3'],
			"headers": ['b1h', 'b2h', 'b3h'],
		},
		'/': {
			"files": ['x1', 'x2', 'x3'],
			"headers": ['x1h', 'x2h', 'x3h'],
		},
		'/:slug': {
			"files": ['y1', 'y2', 'y3'],
			"headers": ['y1h', 'y2h', 'y3h'],
		},
		'*': {
			"files": ['*1', '*2', '*3'],
			"headers": ['*1h', '*2h', '*3h'],
		},
	};

	console.log('"/"');

	t.same(parse(data, '/'), data['/'], '~> returns its own entry only');

	t.same(
		parse(data, '/', true),
		{
			files: [ ...data['*'].files, ...data['/'].files ],
			headers: [ ...data['*'].headers, ...data['/'].headers ],
		},
		'~> returns its own entry, prefixed by "*" commons'
	);

	console.log('"/users/bob"');

	t.same(parse(data, '/users/bob'), data['/users/:name'], '~> returns its own entry only');

	t.same(
		parse(data, '/users/bob', true),
		{
			files: [ ...data['*'].files, ...data['/users/:name'].files ],
			headers: [ ...data['*'].headers, ...data['/users/:name'].headers ],
		},
		'~> returns its own entry, prefixed by "*" commons'
	);

	console.log('"/users"');

	t.same(parse(data, '/users'), data['/:slug'], '~> returns its own entry only');

	t.same(
		parse(data, '/users', true),
		{
			files: [ ...data['*'].files, ...data['/:slug'].files ],
			headers: [ ...data['*'].headers, ...data['/:slug'].headers ],
		},
		'~> returns its own entry, prefixed by "*" commons'
	);

	console.log('"/does/not/exist"');

	t.same(
		parse(data, '/does/not/exist'),
		{ files: [], headers: [] },
		'~> returns empty contents'
	);

	t.same(parse(data, '/does/not/exist', true), data['*'], '~> returns "*" commons only');

	t.end();
});
