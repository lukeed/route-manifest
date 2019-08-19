const test = require('tape');
const Manifest = require('../dist/manifest');

test('exports', t => {
	t.is(typeof Manifest, 'function');
	t.end();
});
