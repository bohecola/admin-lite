const files = import.meta.globEager('../api/**/*.js');

export const service = Object.keys(files).reduce((prev, path) => {
  const m = {};

  for(const i in files[path]) {
    m[i] = files[path][i];
  }

  const filename = path.match(/\w+(?=\.js)/g)[0];

  prev[filename] = m;

  return prev;
}, {});
