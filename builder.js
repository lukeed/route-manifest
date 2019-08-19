const fs = require('fs');
const mkdir = require('mk-dirs');
const pretty = require('pretty-bytes');
const { minify } = require('terser');
const sizer = require('gzip-size');
const pkg = require('./package');

const ESM = fs.readFileSync('src/index.js', 'utf8');
const regexparam = require('regexparam').toString();

mkdir('dist').then(() => {
	// Copy as is for ESM
	fs.writeFileSync(pkg.module, ESM);

	// Mutate (im|ex)ports for CJS
	const CJS = ESM.replace(
		`import toRegExp from 'regexparam';`,
		`var toRegExp = require('regexparam');`
	).replace(/export default/, 'module.exports =')

	fs.writeFileSync(pkg.main, CJS);

	// Mutate again for UMD prep :: inline dependency
	const INLINED = regexparam.replace('function ', 'function toRegExp').concat(
		CJS.replace(`var toRegExp = require('regexparam');`, '')
	);

	// Minify & print gzip-size
	const { code } = minify(INLINED, { toplevel:true, compress:{ passes:10 } });
	console.log(`> gzip size: ${pretty(sizer.sync(code))}`);

	// Write UMD bundle
	const name = pkg['umd:name'] || pkg.name;
	let UMD = `!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.${name}=t()}(this,function(){`;
	UMD += code.replace(/module.exports=/, 'return ') + '});';
	fs.writeFileSync(pkg.unpkg, UMD);
});
