import fs from 'fs';

const stylesPath = 'node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system-offline.min.css';

const rxFont = /(?<!-)\b(font-size:)( )?([0-9]?[.]?[0-9]+)(%)?(rem)?(em)?(px)?/;
const rxFontSize = /([0-9]?[.]?[0-9]+)(%)?(rem)?(em)?(px)?/;
const sldsVarAssignment = /(--slds-[A-Za-z\-]+:).*/;

function extractFont(str) {
    const extracted = rxFont.exec(str);
    if (extracted) {
        return extracted[0]
    }
    return '';
}

function extractFontSize(str) {
    const extracted = rxFontSize.exec(str);
    if (extracted) {
        return extracted[0]
    }
    return '';
}

const fontMap = {
    '0': '0',
    '.625rem': 'var(--font-size-xxx-small, .625em)',
    '.75rem': 'var(--font-size-xx-small, .75em)',
    '.8125rem': 'var(--font-size-x-small, .8125em)',
    '.875rem': 'var(--font-size-small, .875em)',
    '0.625rem': 'var(--font-size-xxx-small, .625em)',
    '0.75rem': 'var(--font-size-xx-small, .75em)',
    '0.8125rem': 'var(--font-size-x-small, .8125em)',
    '0.875rem': 'var(--font-size-small, .875em)',
    '1rem': 'var(--font-size, 1em)',
    '1.125rem': 'var(--font-size-large, 1.125em)',
    '1.25rem': 'var(--font-size-x-large, 1.25em)',
    '1.5rem': 'var(--font-size-xx-large, 1.5em)',
    '1.75rem': 'var(--font-size-xxx-large, 1.75em)',
    '2rem': 'var(--font-size-xxxx-large, 2em)',
    '2.625rem': '2.625em',
    '.625em': 'var(--font-size-xxx-small, .625em)',
    '.75em': 'var(--font-size-xx-small, .75em)',
    '.8125em': 'var(--font-size-x-small, .8125em)',
    '.875em': 'var(--font-size-small, .875em)',
    '0.625em': 'var(--font-size-xxx-small, .625em)',
    '0.75em': 'var(--font-size-xx-small, .75em)',
    '0.8125em': 'var(--font-size-x-small, .8125em)',
    '0.875em': 'var(--font-size-small, .875em)',
    '1em': 'var(--font-size, 1em)',
    '1.125em': 'var(--font-size-large, 1.125em)',
    '1.25em': 'var(--font-size-x-large, 1.25em)',
    '1.5em': 'var(--font-size-xx-large, 1.5em)',
    '1.75em': 'var(--font-size-xxx-large, 1.75em)',
    '2em': 'var(--font-size-xxxx-large, 2em)',
    '2.625em': '2.625em'
};

function generateStylesMap(stylesString, styleRegex) {
    let stylesBySelector = {};
    let lastIndex = 0;
    let nextIndex = 0;
    while(true) {
        if (nextIndex > 0 && nextIndex === lastIndex) {
            break;
        }
        const foundIndex = stylesString.substring(nextIndex).search(rxFont);
        if (!foundIndex || foundIndex === -1) {
            break;
        }
        nextIndex = nextIndex + foundIndex;

        let openingBracket = nextIndex;
        let stepBack = nextIndex;

        let font = styleRegex(stylesString.substring(nextIndex));

        while (stepBack > 0) {
            if (stylesString[stepBack] === '{') {
                openingBracket = stepBack;
            }
            if (stylesString[stepBack] === '}') {
                break;
            }
            stepBack -= 1;
        }
        stepBack += 1;

        let classes = stylesString.slice(stepBack, openingBracket).trim().replaceAll('\n', ' ');
        let classOrig = classes;

        while(true) {
            classes = classes.replaceAll('  ', ' ');
            if (classes === classOrig) {
                break;
            }
            classOrig = classes;
        }

        stylesBySelector[classes] = font;

        lastIndex = font?.length ?? 1;
        nextIndex += font?.length ?? 1;
    }

    return stylesBySelector;
}

function parseFontSizes() {
    const stylesString = fs.readFileSync(stylesPath, { encoding: 'utf8' });

    const fontsBySelector = generateStylesMap(stylesString, extractFont);

    const remappedFonts = Object.keys(fontsBySelector).reduce((acc, key) => {
        const font = fontsBySelector[key];
        const fontSize = extractFontSize(font);
        acc[key] = fontMap[fontSize] ?? fontSize;
        return acc;
    }, {})

    const fontString = Object.keys(remappedFonts).reduce((acc, a) => acc + `${a}{font-size:${remappedFonts[a]};}`, '');
    fs.writeFileSync('src/assets/fontSizes.css', fontString);
    console.log('Wrote Font Size Styles Override');
}

parseFontSizes();