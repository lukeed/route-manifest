import toRegExp from 'regexparam';

export default function (manifest, uri, wCommon) {
	var k,
		tmp = wCommon && manifest['*'] || [],
		headers = tmp.headers || [],
		files = tmp.files || tmp;

	for (k in manifest) {
		if (k != '*' && toRegExp(k).pattern.test(uri)) {
			tmp = manifest[k];
			files = files.concat(tmp.files || tmp);
			headers = headers.concat(tmp.headers || []);
			break;
		}
	}

	return {
		files: files,
		headers: headers,
	};
}
