import fs from 'fs';
import { exec } from 'child_process';
import gulp from 'gulp';
import theo from 'theo';
import pascalCase from 'pascal-case';
import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';
import upperFirst from 'lodash.upperfirst';
import tinycolor from 'tinycolor2';
import ase from 'ase-utils';

import versions from '../util/versions';
import sassVar from '../util/sassvar';
import getGulpTask from '../util/getgulptask';
import { constantCase, javascriptConst } from '../util/constantcase';
import getPercentageRGB from '../util/getpercentagergb';

const colorTokensPath = 'packages/seeds-color/tokens.yml';

function getGulpColorTask(transform, format, opts = {}) {
  return getGulpTask('seeds-color', transform, format, opts);
}

gulp.task('color-scss', getGulpColorTask('web', 'scss'));
gulp.task('color-js', getGulpColorTask('js', 'common.js'));
gulp.task('color-swift', getGulpColorTask('swift', 'swift', {
  filename: `UIColor+${pascalCase('seeds-color')}`,
  dest: 'docs/downloads',
  prependFile: `// seeds-color\n// version ${versions['seeds-color']}`
}));
gulp.task('color-android', getGulpColorTask('android', 'android.xml', {
  filename: snakeCase('seeds-color'),
  dest: 'docs/downloads'
}));
gulp.task('color-python', getGulpColorTask('web', 'python.py', {
  filename: snakeCase('seeds-color'),
  dest: 'docs/downloads',
  prependFile: `# seeds-color\n# version ${versions['seeds-color']}`
}));
gulp.task('color-sketch', getGulpColorTask('designapp', 'sketch.sketchpalette', {
  appendVersion: true,
  dest: 'docs/downloads'
}));

gulp.task('color-ase', () => {
  return gulp.src(colorTokensPath)
    .pipe(theo.plugins.transform('designapp'))
    .pipe(theo.plugins.format('ase'))
    .pipe(theo.plugins.getResult((result) => {
      const wstream = fs.createWriteStream(`docs/downloads/seeds-color.${versions['seeds-color']}.ase`);
      wstream.write(ase.encode(JSON.parse(result)));
      wstream.end();
    }));
});

gulp.task('color-clr', ['color-ase'], (cb) => {
  const downloadDir = `${process.cwd()}/docs/downloads`;
  exec(`${process.cwd()}/node_modules/ase-util/bin/ase2clr ${downloadDir}/seeds-color.${versions['seeds-color']}.ase ${downloadDir}/seeds-color.${versions['seeds-color']}.clr`, (err) => {
    cb(err);
  });
});

gulp.task('color-docs', () => {
  theo.plugins
    .file(colorTokensPath)
    .pipe(theo.plugins.transform('web'))
    .pipe(theo.plugins.getResult((result) => {
      const tokens = JSON.parse(result);
      const colors = tokens.propKeys.map((key) => {
        const prop = tokens.props[key];
        const { category, value } = prop;

        return {
          category,
          value,
          palette: upperFirst(prop.name),
          sass: sassVar(prop.type, prop.name),
          javascript: javascriptConst(prop.type, prop.name),
          swift: `UIColor().${camelCase(prop.name)}()`,
          android: constantCase(prop.name),
          python: camelCase(prop.name),
          rgb: tinycolor(value).toRgbString(value)
        }
      });
      
      fs.writeFileSync('docs/_includes/colors.html', `<!-- GENERATED BY GULP - DO NOT EDIT -->\n\n<script>window.seedsColors = ${JSON.stringify(colors)};</script>`);
    }));
});

gulp.task('color', [
  'color-scss',
  'color-js',
  'color-swift',
  'color-android',
  'color-python',
  'color-docs',
  'color-sketch',
  'color-ase',
  'color-clr'
]);
