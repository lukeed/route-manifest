import toRegExp from 'regexparam';

export default function (manifest, uri, toMerge) {
	var k,
		tmp = manifest['*'] || [],
		headers = tmp.headers || [],
		files = tmp.files || tmp;

	for (k in manifest) {
		if (k !== '*' && toRegExp(k).pattern.test(uri)) {
			tmp = manifest[k];
			if (toMerge) {
				files = files.concat(tmp.files || tmp);
				headers = headers.concat(tmp.headers || []);
			} else {
				files = tmp.files || tmp;
				headers = tmp.headers || [];
			}
			break;
		}
	}

	return {
		files: files,
		headers: headers,
	};
}
