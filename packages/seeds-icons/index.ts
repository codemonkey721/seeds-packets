import {rmSync, mkdirSync, readFileSync, writeFileSync, existsSync} from "fs";
import {sync} from "globby";
import {optimize} from "svgo";
import {basename, extname} from "path";
import svgstore from "svgstore";
import {config} from "./svgo/svgo.config";

if (existsSync('dist')) {
    rmSync('dist', { recursive: true})
    mkdirSync('dist')
} else {
    mkdirSync('dist');
}

const generalOutlinePaths = sync('./svgs/general/outline/*.svg');
const generalSolidPaths = sync('./svgs/general/solid/*.svg');
const sproutOutlinePaths = sync('./svgs/sprout/outline/*.svg');
const sproutSolidPaths = sync('./svgs/sprout/solid/*.svg');

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
    variant: 'outline' | 'solid'
    viewBox: string,
}

function readAndMinifyIcons (paths: string[], variant: 'outline' | 'solid'): TypeIcon[] {
    return paths.map(svgPath => {
        const svg = readFileSync(svgPath, 'utf8');
        const iconName = `${basename(svgPath, extname(svgPath))}-${variant}`;
        const viewBox = svg.match(/viewBox="(\d+ \d+ \d+ \d+)"/)?.[1] ?? '0 0 18 18';
        const minified = optimize(svg, {...config, path: svgPath}).data;
        return {svg: minified, svgPath, iconName, variant, viewBox}
    })
}

// Generate sprite and types for an array of svgs.
function createAssets (svgs: TypeIcon[], scope: 'general' | 'sprout' | 'all') {
    if (existsSync(`src/${scope}`)) {
        rmSync(`src/${scope}`, { recursive: true});
        mkdirSync(`src/${scope}`);
    } else {
        mkdirSync(`src/${scope}`);
    }

    const store = createSvgSpriteStore(svgs);
    const stringStore = store.toString({inline:true})
    writeFileSync(`./src/${scope}/sprite.ts`, `const sprite = '${stringStore}';\nexport default sprite;`);

    createIconNameList(svgs, scope);

    const viewBoxes: { [index: string]: any } = {}
    svgs.forEach(svg => viewBoxes[svg.iconName] = svg.viewBox)
    const stringifiedViewBoxes=JSON.stringify(viewBoxes);
    writeFileSync(`./src/${scope}/viewBoxes.ts`, `const viewBoxes = ${stringifiedViewBoxes};\nexport default viewBoxes;`);
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

function createIconNameList(svgs: TypeIcon[], scope: 'general' | 'sprout' | 'all') {
    const svgNamesWithSuffixes = svgs.map((svg) => svg.iconName);
    // Icon names can also be used without a variant suffix. Add in one copy of each name without the variant suffix
    // by filtering to outline icons then removing -outline from each name.
    const svgNamesWithoutSuffixes = svgs
        .filter((svg) => svg.variant === 'outline')
        .map((svg) => svg.iconName.replace('-outline', ''));
    const svgNames = [...svgNamesWithSuffixes, ...svgNamesWithoutSuffixes];

    // Export an array of possible icon names for the scope
    writeFileSync(`./src/${scope}/iconNames.ts`, `const IconNames = ${JSON.stringify(svgNames)};\nexport default IconNames;`);
}
