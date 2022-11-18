import removeNeutralFills from "./removeNeutralFills";

export const config = {
    multipass: true,
    js2svg: {
        indent: 2,
    },
    plugins: [
        removeNeutralFills,
        {
            name: 'preset-default',
            overrides: {
                sortAttrs: true,
                cleanupAttrs: true,
                removeDimensions: true,
                removeComments: false,
                removeViewBox: false,
                removeAttributesBySelector: {
                    selectors: [
                        {
                            selector: "[aria-hidden='true']",
                            attributes: 'aria-hidden',
                        },
                        {
                            selector: '[data-icon]',
                            attributes: 'data-icon',
                        },
                        {
                            selector: '[data-prefix]',
                            attributes: 'data-prefix',
                        },
                        {
                            selector: "[class*='fa']",
                            attributes: 'class',
                        },
                    ],
                },
            },
        },
    ],
};
