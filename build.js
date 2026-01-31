// Simple build script using esbuild
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist', { recursive: true });

// Build worker
esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/_worker.js',
  platform: 'browser',
  target: 'es2022',
  minify: false,
  sourcemap: false,
}).then(() => {
  console.log('✅ Worker built successfully');
  
  // Copy static files
  const filesToCopy = [
    'index.html',
    'about.html',
    'access.html',
    'events.html',
    'funeral.html',
    'history.html',
    'news.html',
    'omamori.html',
    'prayer.html',
    'wedding.html',
    'sitemap.html'
  ];
  
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
    }
  });
  
  // Copy directories
  const dirsToCopy = ['css', 'news', 'notices', 'public', 'images', 'js', 'events'];
  dirsToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.cpSync(dir, path.join('dist', dir), { recursive: true });
    }
  });
  
  console.log('✅ Static files copied');
  
  // Create _routes.json for Cloudflare Pages
  const routes = {
    version: 1,
    include: ['/admin/*', '/api/*'],
    exclude: []
  };
  
  fs.writeFileSync('dist/_routes.json', JSON.stringify(routes, null, 2));
  console.log('✅ Routes configuration created');
  
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
