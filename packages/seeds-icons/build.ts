import fs from "fs";
import globby from "globby";
import {optimize} from "svgo";
import path from "path";
import svgstore from "svgstore";
import {config} from "./src/svgo.config";

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

fs.copyFileSync('./src/attachSprite.js', './dist/attachSprite.js');
fs.copyFileSync('./src/seeds-icons.d.ts', './dist/seeds-icons.d.ts');
fs.copyFileSync('./src/seeds-icons.js', './dist/seeds-icons.js');

const generalOutlinePaths = globby.sync('./src/svgs/general/outline/*.svg');
const generalSolidPaths = globby.sync('./src/svgs/general/solid/*.svg');
const sproutOutlinePaths = globby.sync('./src/svgs/sprout/outline/*.svg');
const sproutSolidPaths = globby.sync('./src/svgs/sprout/solid/*.svg');

const generalOutlineIcons = readAndMinifyIcons(generalOutlinePaths, 'outline');
const generalSolidIcons = readAndMinifyIcons(generalSolidPaths, 'solid');
const sproutOutlineIcons = readAndMinifyIcons(sproutOutlinePaths, 'outline');
const sproutSolidIcons = readAndMinifyIcons(sproutSolidPaths, 'solid');

const allGeneralIcons = [...generalOutlineIcons, ...generalSolidIcons];
const allSproutIcons = [...sproutOutlineIcons, ...sproutSolidIcons];
const allIcons = [...allGeneralIcons, ...allSproutIcons];

createAssets(allGeneralIcons, 'general');
createAssets(allSproutIcons, 'sprout');
createAssets(allIcons, 'all');

type TypeIcon = {
    svg: string,
    svgPath: string
    iconName: string,
    variant: string
}

function readAndMinifyIcons (paths: string[], variant: string): TypeIcon[] {
    return paths.map(svgPath => {
        const svg = fs.readFileSync(svgPath, 'utf8');
        const iconName = `${path.basename(svgPath, path.extname(svgPath))}-${variant}`;
        const minified = optimize(svg, {path: svgPath, ...config}).data;
        return {svg: minified, svgPath, iconName, variant}
    })
}

// Generate sprite and types for an array of svgs.
function createAssets (svgs: TypeIcon[], scope: string) {
    if (!fs.existsSync(`dist/${scope}`)) {
        fs.mkdirSync(`dist/${scope}`);
    }

    const store = createSvgSpriteStore(svgs);
    fs.writeFileSync(`./dist/${scope}/sprite.svg`, store.toString({inline: true}));

    createEnums(svgs, scope);
}

function createSvgSpriteStore(svgs: TypeIcon[]) {
    const store = svgstore({
        svgAttrs: {
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            viewBox: '0 0 0 0',
            class: `ssicon-svgsprite`,
            'aria-hidden': 'true',
        },
    });

    svgs.forEach(({svg, iconName}) => {
        store.add(`ssiconsvg-${iconName}`, svg);
    });

    return store;
}

function createEnums(svgs: TypeIcon[], scope: string) {
    const svgNamesWithSuffixes = svgs.map((svg) => svg.iconName);
    // Icon names can also be used without a variant suffix. Add in one copy of each name without the variant suffix
    // by filtering to outline icons then removing -outline from each name.
    const svgNamesWithoutSuffixes = svgs
        .filter((svg) => svg.variant === 'outline')
        .map((svg) => svg.iconName.replace('-outline', ''));
    const svgNames = [...svgNamesWithSuffixes, ...svgNamesWithoutSuffixes];

    // Export an array of possible icon names for the scope
    fs.writeFileSync(`./dist/${scope}/IconNames.js`, `module.exports = ${JSON.stringify(svgNames)};`);

    // Create flow type
    fs.writeFileSync(
        `./dist/${scope}/EnumIconNames.js`,
        `// @flow
export type EnumIconNames = "${svgNames.join('" | "')}";`
    );
}
