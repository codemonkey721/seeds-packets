import {writeFileSync, readFileSync} from "fs";
import {sync} from "globby";
import {optimize} from "svgo";
import {config} from "./svgo/svgo.config";
import svgstore from "svgstore";
import {basename, extname} from 'path';

const generalPaths = sync('./svgs/general/*.svg');
const generalAssets = readAndOptimizeSvgs(generalPaths);
const sproutPaths = sync('./svgs/sprout/*.svg');
const sproutAssets = readAndOptimizeSvgs(sproutPaths);
const externalPaths = sync('./svgs/external/*.svg');
const externalAssets = readAndOptimizeSvgs(externalPaths);

writeFileSync(`./src/general.ts`,
    `export const GeneralViewBoxes = ${JSON.stringify(generalAssets.viewBoxes)};
export const GeneralIconNames = ${JSON.stringify(generalAssets.svgNames)};
export const GeneralSprite =  ${JSON.stringify(generalAssets.sprite)};`);

writeFileSync(`./src/external.ts`,
    `export const ExternalViewBoxes = ${JSON.stringify(externalAssets.viewBoxes)};
export const ExternalIconNames = ${JSON.stringify(externalAssets.svgNames)};
export const ExternalSprite =  ${JSON.stringify(externalAssets.sprite)};`);

writeFileSync(`./src/sprout.ts`,
    `export const SproutViewBoxes = ${JSON.stringify(sproutAssets.viewBoxes)};
export const SproutIconNames = ${JSON.stringify(sproutAssets.svgNames)};
export const SproutSprite =  ${JSON.stringify(sproutAssets.sprite)};`);

function readAndOptimizeSvgs(paths: string[]): { svgNames: string[]; viewBoxes: { [svgName: string]: string }; sprite: string; } {
    // Read and optimize svgs
    const icons = paths.map(svgPath => {
        const svg = readFileSync(svgPath, 'utf8');
        const svgName = `${basename(svgPath, extname(svgPath))}`;
        const viewBox = svg.match(/viewBox="(\d+ \d+ \d+ \d+)"/)?.[1] ?? '0 0 18 18';
        const minified = optimize(svg, {...config, path: svgPath}).data;
        return {svg: minified, svgName, viewBox};
    })

    // Create svg sprite store and add each svg to it
    const store = svgstore({
        svgAttrs: {
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            viewBox: '0 0 0 0',
            class: 'seeds-svgsprite',
            'aria-hidden': 'true',
        },
    });

    // Prepare assets
    const svgNames = icons.map((svg) => svg.svgName);
    const viewBoxes: { [svgName: string]: string } = {};
    icons.forEach(svg => {
        viewBoxes[svg.svgName] = svg.viewBox;
        store.add(`seeds-svgs_${svg.svgName}`, svg.svg);
    });

    const sprite = store.toString({inline: true});

    return {sprite, svgNames, viewBoxes};
}
