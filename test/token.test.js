const chromatic = require('../bin/chromatic.js');

function c(s, options = {}) {
    return chromatic('./test/tokens/' + s + '.yaml', {
        header: '',
        console: 'log',
        ignoreErrors: true,
        ...options,
    });
}

const testFiles = {
    simple: 'evaluates a simple token file',
    'no-tokens': 'evaluates a file with no tokens',
    'token-arrays': 'evaluates a file with an array of tokens',
    'invalid-token-name': 'evaluates a token file with an invalid token name',
    expressions: 'evaluates expressions in token values correctly',
    angle: 'evaluates angles correctly',
    'no-colors': 'evaluates color tokens correctly',
    aliases: 'evaluates aliases in token values correctly',
    metadata: 'evaluates comments, etc... associated with a token',
    theme: 'evaluates two themes',
    array: 'evaluates arrays',
    errors: 'handles syntax errors',
};

Object.keys(testFiles).forEach(x => {
    it(testFiles[x], () => {
        expect(c(x)).toMatchSnapshot();
    });
});

it('generates a style guide', () => {
    expect(c('basic-example/tokens', { format: 'html' })).toMatchSnapshot();
});

it('generates a Sass stylesheet', () => {
    expect(c('basic-example/tokens', { format: 'sass' })).toMatchSnapshot();
});

it('generates a JSON file', () => {
    expect(c('basic-example/tokens', { format: 'json' })).toMatchSnapshot();
});
