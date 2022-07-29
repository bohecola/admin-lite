export const proxy = {
  '/dev': {
    target: 'http://127.0.0.1:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/dev/, '')
  },

  '/prod': {
    target: 'https://admin.canday.site',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/prod/, '/api')
  }
};