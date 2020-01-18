// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/master/packages/lwc-services/example/lwc-services.config.js
module.exports = {
  // List of resources for copying to the build folder
  resources: [
    {
      from: 'src/client/favicon.ico',
      to: 'dist/favicon.ico'
    },
    {
      from: 'src/client/manifest.json',
      to: 'dist/manifest.json'
    },
    {
      from: 'src/client/robots.txt',
      to: 'dist/robots.txt'
    },
    {
      from: 'src/client/sw.js',
      to: 'dist/sw.js'
    },
    {
      from: 'src/server/data',
      to: 'dist/data'
    }
  ],
  sourceDir: './src/client',
  moduleDir: './src/client/modules',
  server: {
    customConfig: './src/server/index.js'
  },
  devServer: {
    proxy: { '/': 'http://localhost:3002' }
  },
  // LWC Compiler options for production mode.
  // Find the detailed description here: https://www.npmjs.com/package/@lwc/compiler
  lwcCompilerOutput: {
    production: {
      compat: false,
      minify: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
