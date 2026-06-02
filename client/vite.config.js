const path = require('path');
const react = require('@vitejs/plugin-react');

module.exports = {
  plugins: [react()],
  root: path.resolve(__dirname),
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  }
};
