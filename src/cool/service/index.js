const files = import.meta.globEager("../api/**/*.js");

export const service = Object.keys(files).reduce((prev, path) => {

	const m = {};

	const apis = files[path].default ? files[path].default : files[path];

	for(const i in apis) {
		m[i] = apis[i];
	}

	const filename = path.match(/\w+(?=\.js)/g)[0];

	prev[filename] = m;

	return prev;
}, {});
