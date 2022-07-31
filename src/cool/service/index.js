const apiFiles = import.meta.globEager('../api/**/*.js');

export const service = Object.keys(apiFiles).reduce((prev, path) => {
  const moduleName = path.match(/\w+(?=\.js)/g)[0];
  prev[moduleName] = apiFiles[path];
  return prev;
}, {});
