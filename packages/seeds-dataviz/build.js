const fs = require('fs');

function buildDataVizPackage() {
  console.log('Building @sproutsocial/seeds-dataviz package...');
  // copy seeds-dataviz.js to dist
  fs.copyFileSync('seeds-dataviz.js', 'dist/seeds-dataviz.js');
  
  // copy seeds-dataviz.scss to dist
  fs.copyFileSync('seeds-dataviz.scss', 'dist/seeds-dataviz.scss');
  
  // copy seeds-dataviz.d.ts to dist
  fs.copyFileSync('seeds-dataviz.d.ts', 'dist/seeds-dataviz.d.ts');
  console.log('Built @sproutsocial/seeds-dataviz package');
};

buildDataVizPackage();