'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["NoError"] = 0] = "NoError";
    ErrorCode[ErrorCode["SyntaxError"] = 1] = "SyntaxError";
    ErrorCode[ErrorCode["UnexpectedOpenBracket"] = 2] = "UnexpectedOpenBracket";
    ErrorCode[ErrorCode["ExpectedCloseBracket"] = 3] = "ExpectedCloseBracket";
    ErrorCode[ErrorCode["ExpectedOpenParen"] = 4] = "ExpectedOpenParen";
    ErrorCode[ErrorCode["ExpectedCloseParen"] = 5] = "ExpectedCloseParen";
    ErrorCode[ErrorCode["ExpectedQuote"] = 6] = "ExpectedQuote";
    ErrorCode[ErrorCode["UnknownToken"] = 7] = "UnknownToken";
    ErrorCode[ErrorCode["UnknownUnit"] = 8] = "UnknownUnit";
    ErrorCode[ErrorCode["UnknownFunction"] = 9] = "UnknownFunction";
    ErrorCode[ErrorCode["MissingArgument"] = 10] = "MissingArgument";
    ErrorCode[ErrorCode["ExpectedArgument"] = 11] = "ExpectedArgument";
    ErrorCode[ErrorCode["TooManyArguments"] = 12] = "TooManyArguments";
    ErrorCode[ErrorCode["ExpectedOperand"] = 13] = "ExpectedOperand";
    ErrorCode[ErrorCode["InvalidOperand"] = 14] = "InvalidOperand";
    ErrorCode[ErrorCode["InvalidUnaryOperand"] = 15] = "InvalidUnaryOperand";
    ErrorCode[ErrorCode["ExpectedIntegerIndex"] = 16] = "ExpectedIntegerIndex";
    ErrorCode[ErrorCode["CircularDefinition"] = 17] = "CircularDefinition";
    ErrorCode[ErrorCode["UnexpectedTokensArray"] = 18] = "UnexpectedTokensArray";
    ErrorCode[ErrorCode["UnexpectedTokensType"] = 19] = "UnexpectedTokensType";
    ErrorCode[ErrorCode["InvalidTokenName"] = 20] = "InvalidTokenName";
    ErrorCode[ErrorCode["InvalidTokenValue"] = 21] = "InvalidTokenValue";
    ErrorCode[ErrorCode["InconsistentTokenType"] = 22] = "InconsistentTokenType";
    ErrorCode[ErrorCode["UnknownFormat"] = 23] = "UnknownFormat";
    ErrorCode[ErrorCode["UnknownValueFormatter"] = 24] = "UnknownValueFormatter";
    ErrorCode[ErrorCode["UnknownNameFormatter"] = 25] = "UnknownNameFormatter";
})(ErrorCode || (ErrorCode = {}));
const ERRORS = {
    [ErrorCode.SyntaxError]: 'Syntax error',
    [ErrorCode.UnexpectedOpenBracket]: 'Unexpected `[`',
    [ErrorCode.ExpectedCloseBracket]: 'Expected `]`',
    [ErrorCode.ExpectedOpenParen]: 'Expected `(`',
    [ErrorCode.ExpectedCloseParen]: 'Expected `)`',
    [ErrorCode.ExpectedQuote]: 'Expected `"`',
    [ErrorCode.UnknownToken]: 'Unknown token `%1`%2',
    [ErrorCode.UnknownUnit]: 'Unknown unit `%1`',
    [ErrorCode.UnknownFunction]: 'Unknown function `%1`%2',
    [ErrorCode.MissingArgument]: 'Missing argument %1 of `%2` of type `%3`',
    [ErrorCode.ExpectedArgument]: 'Expected argument %1 of `%2` to be of type `%3`',
    [ErrorCode.TooManyArguments]: 'Too many arguments for function `%1(%2)`',
    [ErrorCode.ExpectedOperand]: 'Expected operand',
    [ErrorCode.InvalidOperand]: 'Invalid operand',
    [ErrorCode.InvalidUnaryOperand]: 'Invalid operand',
    [ErrorCode.CircularDefinition]: 'Circular definition of the "%1" token',
    [ErrorCode.UnexpectedTokensArray]: 'The "tokens" property is an array. It should be a key/value map of tokens.\n%1',
    [ErrorCode.UnexpectedTokensType]: 'The "tokens" property should be a key/value map of tokens.',
    [ErrorCode.InvalidTokenName]: 'Invalid token name "%1": it must only contain digits, letters, "_" and "-"',
    [ErrorCode.InvalidTokenValue]: 'The "%1" token is invalid. If using a YAML file, make sure RGB hex values are within quotes',
    [ErrorCode.InconsistentTokenType]: 'Inconsistent token type: "%1" ( "%2")',
    [ErrorCode.UnknownFormat]: 'Unknown format "%1"%2',
    [ErrorCode.UnknownValueFormatter]: 'Unknown value formatter "%1"%2',
    [ErrorCode.UnknownNameFormatter]: 'Unknown name formatter "%1"%2',
    [ErrorCode.ExpectedIntegerIndex]: 'Expected a number of array index',
};
class SyntaxError extends Error {
    constructor(code, ...args) {
        super();
        this.code = code;
        this.args = args;
    }
}
function throwError(code, ...args) {
    throwErrorWithContext(undefined, code, ...args);
}
function throwErrorWithContext(context, code, ...args) {
    var _a;
    let message = '';
    if (process.env.TEST) {
        message = '[ERR] ' + (_a = ErrorCode[code], (_a !== null && _a !== void 0 ? _a : code));
    }
    else {
        if (context)
            message = context.join('\n') + '\n';
        message += ERRORS[code];
        args.forEach((val, index) => {
            message = message.replace(new RegExp(`%${index + 1}`, 'g'), val);
        });
    }
    throw new Error(message);
}
//# sourceMappingURL=errors.js.map

const stringSimilarity = require('string-similarity');
function findClosestKey(key, o) {
    if (!key || !o)
        return '';
    let keys;
    if (o instanceof Map) {
        keys = Array.from(o.keys());
    }
    else {
        keys = Object.keys(o);
    }
    if (keys.length === 0)
        return '';
    const result = stringSimilarity.findBestMatch(key, keys);
    return result.bestMatch.rating > 0.1 ? result.bestMatch.target : '';
}
function getSuggestion(key, o) {
    const alt = findClosestKey(key, o);
    return alt ? `. Did you mean "${alt}"?` : '';
}
//# sourceMappingURL=utils.js.map

const DefaultFormatters = {
    valueFormatters: {},
    nameFormatters: {
        camelcase: (name, theme) => (name + !theme ? '' : '.' + theme)
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase())
            .replace(/\s+/g, ''),
        kebabcase: (name, theme) => (name + !theme ? '' : '.' + theme)
            .match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
            .filter(Boolean)
            .map(x => x.toLowerCase())
            .join('-'),
        uppercase: (name, theme) => (name + !theme ? '' : '.' + theme).toUpperCase(),
        lowercase: (name, theme) => (name + !theme ? '' : '.' + theme).toLowerCase(),
    },
};
//# sourceMappingURL=default-formatters.js.map

const DEFAULT_FILE_HEADER = `
This file was automatically generated by Chromatic.
Do not edit.
Generated ${new Date().toISOString()}
`;

var _a;
const chalk = require('chalk');
const ciInfo = require('ci-info');
const tcOrange = '#ffcc00';
const tcRed = '#fa2040';
const tcBlue = '#6ab3ff';
const tcPurple = '#d1d7ff';
let gUseColor = (_a = process.stdout.isTTY, (_a !== null && _a !== void 0 ? _a : false)) && !ciInfo.isCI;
const terminal = {
    useColor: (flag) => {
        gUseColor = flag;
    },
    autoFormat: (m) => {
        return m
            .replace(/("(.*)")/g, x => {
            return terminal.string(x.slice(1, -1));
        })
            .replace(/(`(.*)`)/g, x => {
            return terminal.keyword(x);
        });
    },
    success: (m = '') => {
        chalk.green('✔︎   ' + m);
        return gUseColor ? chalk.bold.green('✔︎   ' + m) : '✔︎   ' + m;
    },
    error: (m = '') => {
        return gUseColor
            ? chalk.hex(tcRed)(chalk.bold('✘   ' + m))
            : '✘   ' + m;
    },
    warning: (m = '') => {
        return gUseColor
            ? chalk.hex(tcOrange)(chalk.bold('⚠️   ' + m))
            : '⚠   ' + m;
    },
    path: (m = '') => {
        return gUseColor ? chalk.hex(tcBlue).italic(m) : m;
    },
    keyword: (m = '') => {
        return gUseColor ? chalk.hex(tcOrange)(m) : m;
    },
    string: (m = '') => {
        return gUseColor
            ? chalk.hex(tcOrange)('"' + chalk.italic(m) + '"')
            : '"' + m + '"';
    },
    dim: (m = '') => {
        return gUseColor ? chalk.hex('#999')(m) : m;
    },
    time: (t = new Date()) => {
        return gUseColor
            ? chalk.hex(tcPurple)(`[${t.toLocaleTimeString()}]`)
            : '[' + t + ']';
    },
    link: (m) => {
        return gUseColor
            ? '\n▷   ' +
                chalk.hex(tcPurple)('https://github.com/arnog/chromatic/docs/errors/' +
                    m +
                    '.md')
            : '\n▷   https://github.com/arnog/chromatic/docs/errors/' +
                m +
                '.md';
    },
};
//# sourceMappingURL=terminal.js.map

const colorName = require('color-name');
const chroma = require('chroma-js');
function clampByte(v) {
    if (v < 0)
        return 0;
    if (v > 255)
        return 255;
    return Math.round(v);
}
function hueToRgbChannel(t1, t2, hue) {
    if (hue < 0)
        hue += 6;
    if (hue >= 6)
        hue -= 6;
    if (hue < 1)
        return (t2 - t1) * hue + t1;
    else if (hue < 3)
        return t2;
    else if (hue < 4)
        return (t2 - t1) * (4 - hue) + t1;
    else
        return t1;
}
function hslToRgb(hue, sat, light) {
    hue = hue / 60.0;
    const t2 = light <= 0.5 ? light * (sat + 1) : light + sat - light * sat;
    const t1 = light * 2 - t2;
    return {
        r: Math.round(255 * hueToRgbChannel(t1, t2, hue + 2)),
        g: Math.round(255 * hueToRgbChannel(t1, t2, hue)),
        b: Math.round(255 * hueToRgbChannel(t1, t2, hue - 2)),
    };
}
function rgbToHsl(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;
    if (max === min) {
        h = 0;
    }
    else if (r === max) {
        h = (g - b) / delta;
    }
    else if (g === max) {
        h = 2 + (b - r) / delta;
    }
    else if (b === max) {
        h = 4 + (r - g) / delta;
    }
    h = Math.min(h * 60, 360);
    if (h < 0) {
        h += 360;
    }
    const l = (min + max) / 2;
    if (max === min) {
        s = 0;
    }
    else if (l <= 0.5) {
        s = delta / (max + min);
    }
    else {
        s = delta / (2 - max - min);
    }
    return { h: h, s: s, l: l };
}
function labToRgb(L, aStar, bStar) {
    let y = (100 * L + 16) / 116;
    let x = aStar / 500 + y;
    let z = y - bStar / 200;
    x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
    y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
    z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let b = x * 0.0557 + y * -0.204 + z * 1.057;
    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;
    return {
        r: clampByte(r * 255),
        g: clampByte(g * 255),
        b: clampByte(b * 255),
    };
}
function hwbToRgb(hue, white, black) {
    const rgb = hslToRgb(hue, 1, 0.5);
    const xs = [];
    xs[0] = rgb.r / 255;
    xs[1] = rgb.g / 255;
    xs[2] = rgb.b / 255;
    const total = white + black;
    if (total > 1) {
        white = Number((white / total).toFixed(2));
        black = Number((black / total).toFixed(2));
    }
    for (let i = 0; i < 3; i++) {
        xs[i] *= 1 - white - black;
        xs[i] += white;
        xs[i] = Number(xs[i] * 255);
    }
    return { r: xs[0], g: xs[1], b: xs[2] };
}
function parseColorName(name) {
    const color = colorName[name.toLowerCase()];
    if (color) {
        return {
            r: color[0],
            g: color[1],
            b: color[2],
            a: 1,
        };
    }
    return undefined;
}
function parseHex(hex) {
    if (!hex)
        return undefined;
    if (hex[0] !== '#')
        return undefined;
    hex = hex.slice(1);
    let result;
    if (hex.length <= 4) {
        result = {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
        };
        if (hex.length === 4) {
            result.a = parseInt(hex[3] + hex[3], 16) / 255;
        }
    }
    else {
        result = {
            r: parseInt(hex[0] + hex[1], 16),
            g: parseInt(hex[2] + hex[3], 16),
            b: parseInt(hex[4] + hex[5], 16),
        };
        if (hex.length === 8) {
            result.a = parseInt(hex[6] + hex[7], 16) / 255;
        }
    }
    if (result && typeof result.a === 'undefined')
        result.a = 1.0;
    return result;
}
function roundTo(num, precision) {
    return (Math.round(num * Math.pow(10, precision) + 1e-14) /
        Math.pow(10, precision));
}
class Value {
    constructor() {
        this.source = '';
    }
    css() {
        return '';
    }
    type() {
        return undefined;
    }
    canonicalScalar() {
        return 0;
    }
    getSource() {
        return this.source;
    }
    setSource(source) {
        this.source = source;
    }
}
class Percentage extends Value {
    constructor(from) {
        super();
        this.value = from;
    }
    css() {
        return roundTo(this.value, 2) + '%';
    }
    type() {
        return 'percentage';
    }
    canonicalScalar() {
        return this.value / 100;
    }
}
class Angle extends Value {
    constructor(from, unit) {
        super();
        this.value = from;
        this.unit = unit;
    }
    css() {
        return roundTo(this.value, 2) + this.unit;
    }
    type() {
        return 'angle';
    }
    canonicalScalar() {
        return asDegree(this);
    }
}
class Length extends Value {
    constructor(from, unit) {
        super();
        if (typeof from === 'number') {
            this.value = from;
            if (from === 0) {
                this.unit = 'px';
            }
            else {
                this.unit = unit;
            }
        }
        else if (typeof unit === 'undefined') {
            const nonZeroKeys = Object.keys(from).filter(x => typeof from[x] === 'number' && from[x] !== 0);
            if (nonZeroKeys.length === 0) {
                this.value = 0;
                this.unit = 'px';
            }
            else if (nonZeroKeys.length === 1) {
                this.value = from[nonZeroKeys[0]];
                this.unit = nonZeroKeys[0];
            }
            else {
                this.value = from;
                this.unit = 'multi';
            }
        }
        else {
            this.value = from;
            this.unit = 'multi';
            console.assert(unit === 'multi');
        }
    }
    css() {
        if (typeof this.value === 'number') {
            return this.value === 0 || isNaN(this.value)
                ? Number(this.value).toString()
                : roundTo(this.value, 2) + this.unit;
        }
        const result = {};
        let units = Object.keys(this.value);
        if (units.length > 1) {
            let pxSum = 0;
            units.forEach(x => {
                const inPx = asPx(this.value[x], x);
                if (!isNaN(inPx)) {
                    pxSum += inPx;
                }
                else if (x !== 'px') {
                    result[x] = this.value[x];
                }
            });
            if (pxSum !== 0) {
                result['px'] = pxSum;
            }
        }
        else {
            result[units[0]] = this.value[units[0]];
        }
        units = Object.keys(result);
        if (units.length === 1) {
            if (units[0] === 'px' && result['px'] === 0) {
                return '0';
            }
            return roundTo(result[units[0]], 2) + units[0];
        }
        return ('calc(' +
            units.map(x => Number(result[x]).toString() + x).join(' + ') +
            ')');
    }
    type() {
        return 'length';
    }
    canonicalScalar() {
        return this.unit === 'multi'
            ? NaN
            : asPx(this.value, this.unit);
    }
}
class Time extends Value {
    constructor(from, unit) {
        super();
        this.value = from;
        this.unit = unit;
    }
    css() {
        return roundTo(this.value, 2) + this.unit;
    }
    type() {
        return 'time';
    }
    canonicalScalar() {
        return this.unit === 'ms' ? this.value / 1000 : this.value;
    }
}
class Frequency extends Value {
    constructor(from, unit) {
        super();
        this.value = from;
        this.unit = unit;
    }
    css() {
        return roundTo(this.value, 2) + this.unit;
    }
    type() {
        return 'frequency';
    }
    canonicalScalar() {
        return this.unit === 'khz' ? this.value * 1000 : this.value;
    }
}
class Float extends Value {
    constructor(from) {
        super();
        this.value = from;
    }
    css() {
        return Number(this.value).toString();
    }
    type() {
        return 'float';
    }
    canonicalScalar() {
        return this.value;
    }
}
class StringValue extends Value {
    constructor(from) {
        super();
        this.value = from;
    }
    css(quoteLiteral = '') {
        return quoteLiteral + this.value + quoteLiteral;
    }
    type() {
        return 'string';
    }
    canonicalScalar() {
        return parseFloat(this.value);
    }
}
class Color extends Value {
    constructor(from) {
        super();
        if (typeof from === 'string') {
            if (from.toLowerCase() === 'transparent') {
                [this.r, this.g, this.b, this.a] = [0, 0, 0, 0];
                [this.h, this.s, this.l] = [0, 0, 0];
            }
            else {
                const rgb = parseHex(from) || parseColorName(from);
                if (!rgb)
                    throw new Error();
                Object.assign(this, rgb);
                Object.assign(this, rgbToHsl(this.r, this.g, this.b));
            }
        }
        else {
            Object.assign(this, from);
            if (typeof this.r === 'number') {
                Object.assign(this, rgbToHsl(this.r, this.g, this.b));
            }
            else {
                console.assert(typeof this.h === 'number');
                this.h = (this.h + 360) % 360;
                this.s = Math.max(0, Math.min(1.0, this.s));
                this.l = Math.max(0, Math.min(1.0, this.l));
                Object.assign(this, hslToRgb(this.h, this.s, this.l));
            }
        }
        if (typeof this.a !== 'number') {
            this.a = 1.0;
        }
    }
    type() {
        return 'color';
    }
    opaque() {
        return new Color({ r: this.r, g: this.g, b: this.b });
    }
    luma() {
        let r = this.r / 255.0;
        let g = this.g / 255.0;
        let b = this.b / 255.0;
        r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    hex() {
        let hexString = ((1 << 24) +
            (clampByte(this.r) << 16) +
            (clampByte(this.g) << 8) +
            clampByte(this.b))
            .toString(16)
            .slice(1);
        if (this.a < 1.0) {
            hexString += ('00' + Math.round(this.a * 255).toString(16)).slice(-2);
        }
        if (hexString[0] === hexString[1] &&
            hexString[2] === hexString[3] &&
            hexString[4] === hexString[5] &&
            hexString[6] === hexString[7]) {
            hexString =
                hexString[0] +
                    hexString[2] +
                    hexString[4] +
                    (this.a < 1.0 ? hexString[6] : '');
        }
        return '#' + hexString;
    }
    rgb() {
        return `rgb(${this.r}, ${this.g}, ${this.b}${this.a < 1.0 ? ', ' + Number(100 * this.a).toFixed(0) + '%' : ''})`;
    }
    hsl() {
        return `hsl(${this.h}deg, ${this.s}%, ${this.l}%, ${this.a < 1.0 ? ', ' + Number(100 * this.a).toFixed(0) + '%' : ''})`;
    }
    css() {
        if (this.r === 0 && this.g === 0 && this.b === 0 && this.a === 0)
            return 'transparent';
        if (this.a < 1) {
            return this.rgb();
        }
        return this.hex();
    }
    canonicalScalar() {
        return this.luma();
    }
}
class ArrayValue extends Value {
    constructor(from) {
        super();
        this.value = from.map(x => makeValueFrom(x));
    }
    get(index) {
        return this.value[index];
    }
    type() {
        return 'array';
    }
    css() {
        return '"[' + this.value.map(x => x.css()).join(', ') + ']"';
    }
}
function isFloat(arg) {
    return arg instanceof Float;
}
function assertFloat(arg) {
    console.assert(arg instanceof Float);
}
function assertFloatOrPercentage(arg) {
    console.assert(arg instanceof Float || arg instanceof Percentage);
}
function assertLength(arg) {
    console.assert(arg instanceof Length);
}
function isColor(arg) {
    return arg instanceof Color;
}
function isPercentage(arg) {
    return arg instanceof Percentage;
}
function isLength(arg) {
    return arg instanceof Length;
}
function isString(arg) {
    return arg instanceof StringValue;
}
function isAngle(arg) {
    return arg instanceof Angle;
}
function isTime(arg) {
    return arg instanceof Time;
}
function isFrequency(arg) {
    return arg instanceof Frequency;
}
function isZero(arg) {
    return arg instanceof Float && arg.value === 0;
}
function makeValueFrom(from) {
    switch (from.type()) {
        case 'color':
            return new Color(from);
        case 'frequency':
            return new Frequency(from.value, from.unit);
        case 'time':
            return new Time(from.value, from.unit);
        case 'angle':
            return new Angle(from.value, from.unit);
        case 'string':
            return new StringValue(from.value);
        case 'length':
            return new Length(from.value, from.unit);
        case 'percentage':
            return new Percentage(from.value);
        case 'float':
            return new Float(from.value);
        case 'array':
            return new ArrayValue(from.value.map(makeValueFrom));
        default:
            console.error('Unknown value type');
    }
    return undefined;
}
function asColor(value) {
    if (!value)
        return undefined;
    let result;
    try {
        result = new Color(value);
    }
    catch (_err) {
        result = undefined;
    }
    return result;
}
function asDecimalByte(value) {
    if (isPercentage(value)) {
        return Math.round((255 * value.value) / 100);
    }
    assertFloat(value);
    return Math.round(value.value);
}
function asInteger(value, defaultValue) {
    if (isFloat(value)) {
        return Math.round(value.value);
    }
    if (typeof defaultValue === 'undefined')
        assertFloat(value);
    return defaultValue;
}
function asDecimalRatio(value, defaultValue) {
    if (isPercentage(value)) {
        return value.value / 100;
    }
    else if (isFloat(value)) {
        return value.value;
    }
    if (typeof defaultValue === 'undefined')
        assertFloatOrPercentage(value);
    return defaultValue;
}
function asDegree(value) {
    if (isAngle(value)) {
        if (value.unit === 'deg') {
            return value.value;
        }
        else if (value.unit === 'rad') {
            return (value.value * 180) / Math.PI;
        }
        else if (value.unit === 'grad') {
            return (value.value * 180) / 200;
        }
        else if (value.unit === 'turn') {
            return value.value * 360.0;
        }
        throwError(ErrorCode.UnknownUnit, value.unit);
    }
    else {
        assertFloat(value);
        return value.value;
    }
}
function asPx(value, unit, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (typeof value !== 'number') {
        console.assert(unit === 'multi');
        let pxSum = (_a = value['px'], (_a !== null && _a !== void 0 ? _a : 0));
        Object.keys(value).forEach(x => {
            const inPx = asPx(this.value[x], x, options);
            if (isNaN(inPx))
                return NaN;
            pxSum += pxSum;
        });
        return pxSum;
    }
    if (unit === 'px') {
        return value;
    }
    else if (unit === 'cm') {
        return (value * 96.0) / 2.54;
    }
    else if (unit === 'mm') {
        return (value * 96.0) / 25.4;
    }
    else if (unit === 'Q') {
        return (value * 96.0) / 2.54 / 40.0;
    }
    else if (unit === 'in') {
        return value * 96.0;
    }
    else if (unit === 'pc') {
        return value * 16.0;
    }
    else if (unit === 'pt') {
        return (value * 96.0) / 72.0;
    }
    let base;
    if (unit === 'vmin') {
        base = Math.min((_d = (_c = (_b = options) === null || _b === void 0 ? void 0 : _b.baseUnits) === null || _c === void 0 ? void 0 : _c.vh, (_d !== null && _d !== void 0 ? _d : NaN)), (_g = (_f = (_e = options) === null || _e === void 0 ? void 0 : _e.baseUnits) === null || _f === void 0 ? void 0 : _f.vw, (_g !== null && _g !== void 0 ? _g : NaN)));
    }
    else if (unit === 'vmax') {
        base = Math.max((_k = (_j = (_h = options) === null || _h === void 0 ? void 0 : _h.baseUnits) === null || _j === void 0 ? void 0 : _j.vh, (_k !== null && _k !== void 0 ? _k : NaN)), (_o = (_m = (_l = options) === null || _l === void 0 ? void 0 : _l.baseUnits) === null || _m === void 0 ? void 0 : _m.vw, (_o !== null && _o !== void 0 ? _o : NaN)));
    }
    else {
        base = (_r = (_q = (_p = options) === null || _p === void 0 ? void 0 : _p.baseUnits) === null || _q === void 0 ? void 0 : _q[unit], (_r !== null && _r !== void 0 ? _r : NaN));
    }
    return base * value;
}
function asPercent(value) {
    if (isPercentage(value)) {
        return value.value / 100;
    }
    assertFloat(value);
    return value.value;
}
function asString(value, defaultValue) {
    if (!isString(value)) {
        return defaultValue;
    }
    return value.value;
}
function compareValue(a, b) {
    return b.canonicalScalar() - a.canonicalScalar();
}
function promoteToMulti(value) {
    if (isFloat(value)) {
        return new Length({ px: value.value }, 'multi');
    }
    if (value.unit === 'multi')
        return value;
    const newValue = {};
    newValue[value.unit] = value.value;
    return new Length(newValue, 'multi');
}
const whiteColor = new Color('#fff');
const blackColor = new Color('#000');
function scaleColor(arg1, arg2, arg3, arg4) {
    var _a, _b;
    let c1 = new Color('#fff');
    let c2;
    let c3 = new Color('#000');
    let n = 10;
    if (((_a = arg3) === null || _a === void 0 ? void 0 : _a.type()) === 'color') {
        c1 = asColor(arg1);
        c2 = asColor(arg2);
        c3 = asColor(arg3);
        n = asInteger(arg4, 10);
    }
    else if (((_b = arg2) === null || _b === void 0 ? void 0 : _b.type()) === 'color') {
        c1 = asColor(arg1);
        c2 = asColor(arg2);
        c3 = asColor(arg2);
        n = asInteger(arg3, 10);
    }
    else if (arg1.type() === 'color') {
        c2 = asColor(arg1);
        c3 = new Color({
            h: c2.h >= 60 && c2.h <= 240 ? c2.h + 30 : c2.h - 30,
            s: c2.s,
            l: 0.35,
        });
        n = asInteger(arg2, 10);
        const mode = new StringValue('rgb');
        return new ArrayValue([
            FUNCTIONS.mix(c1, c2, new Float(0.12), mode),
            FUNCTIONS.mix(c1, c2, new Float(0.3), mode),
            FUNCTIONS.mix(c1, c2, new Float(0.5), mode),
            FUNCTIONS.mix(c1, c2, new Float(0.7), mode),
            FUNCTIONS.mix(c1, c2, new Float(0.85), mode),
            c2,
            FUNCTIONS.mix(c3, c2, new Float(0.85), mode),
            FUNCTIONS.mix(c3, c2, new Float(0.7), mode),
            FUNCTIONS.mix(c3, c2, new Float(0.5), mode),
            FUNCTIONS.mix(c3, c2, new Float(0.2), mode),
        ]);
    }
    if (!c1 || !c2 || !c3)
        return undefined;
    const colors = chroma
        .scale([c1.opaque().hex(), c2.opaque().hex(), c3.opaque().hex()])
        .mode('lab')
        .correctLightness()
        .colors(n + 1);
    return new ArrayValue(colors.map(x => new Color(x)));
}
let FUNCTIONS = {};
FUNCTIONS = {
    calc: (x) => x,
    rgb: (r, g, b, a) => {
        return new Color({
            r: asDecimalByte(r),
            g: asDecimalByte(g),
            b: asDecimalByte(b),
            a: asDecimalRatio(a, 1.0),
        });
    },
    hsl: (h, s, l, a) => {
        return new Color({
            h: asDegree(h),
            s: asPercent(s),
            l: asPercent(l),
            a: asDecimalRatio(a, 1.0),
        });
    },
    hsv: (h, sat, val, a) => {
        let s = asPercent(sat);
        const v = asPercent(val);
        const l = ((2 - s) * v) / 2;
        if (l != 0) {
            if (l == 1) {
                s = 0;
            }
            else if (l < 0.5) {
                s = (s * v) / (l * 2);
            }
            else {
                s = (s * v) / (2 - l * 2);
            }
        }
        return new Color({
            h: asDegree(h),
            s: s,
            l: l,
            a: asDecimalRatio(a, 1.0),
        });
    },
    hwb: (h, w, b, a) => {
        return new Color(Object.assign({ a: asDecimalRatio(a, 1.0) }, hwbToRgb(asDegree(h), asPercent(w), asPercent(b))));
    },
    lab: (l, a, b, alpha) => {
        return new Color(Object.assign({ a: asDecimalRatio(alpha, 1.0) }, labToRgb(asPercent(l), asDecimalRatio(a), asDecimalRatio(b))));
    },
    gray: (g, alpha) => {
        return new Color(Object.assign({ a: asDecimalRatio(alpha, 1.0) }, labToRgb(asPercent(g), 0, 0)));
    },
    min: (a, b) => {
        return compareValue(a, b) < 0 ? a : b;
    },
    max: (a, b) => {
        return compareValue(a, b) < 0 ? b : a;
    },
    clamp(a, b, c) {
        return compareValue(b, a) < 0 ? a : compareValue(b, c) > 0 ? c : b;
    },
    mix: (c1, c2, weight, model) => {
        const modelName = asString(model, 'hsl').toLowerCase();
        const color1 = asColor(c1);
        if (!color1)
            return undefined;
        const color2 = asColor(c2);
        if (!color2)
            return color1;
        const w = asDecimalRatio(weight, 0.5);
        let alpha = typeof color2.a === 'number' ? color2.a : 1.0;
        alpha =
            alpha +
                ((typeof color1.a === 'number' ? color2.a : 1.0) - alpha) * w;
        if (modelName === 'rgb') {
            return new Color({
                r: color1.r + (color2.r - color1.r) * w,
                g: color1.g + (color2.g - color1.g) * w,
                b: color1.b + (color2.b - color1.b) * w,
                a: alpha,
            });
        }
        else if (modelName === 'hsl') {
            return new Color({
                h: color1.h + (color2.h - color1.h) * w,
                s: color1.s + (color2.s - color1.s) * w,
                l: color1.l + (color2.l - color1.l) * w,
                a: alpha,
            });
        }
    },
    saturate: (c, v) => {
        const color = asColor(c);
        if (!color)
            return undefined;
        return new Color({
            h: color.h,
            s: color.s + (1.0 - color.s) * asDecimalRatio(v, 0.1),
            l: color.l,
            a: color.a,
        });
    },
    desaturate: (c, v) => {
        const color = asColor(c);
        if (!color)
            return undefined;
        return new Color({
            h: color.h,
            s: color.s - color.s * asDecimalRatio(v, 0.1),
            l: color.l,
            a: color.a,
        });
    },
    lighten: (c, v) => {
        const color = asColor(c);
        if (!color)
            return undefined;
        return new Color({
            h: color.h,
            s: color.s,
            l: color.l + (1.0 - color.l) * asDecimalRatio(v, 0.1),
            a: color.a,
        });
    },
    darken: (c, v) => {
        const color = asColor(c);
        if (!color)
            return undefined;
        return new Color({
            h: color.h,
            s: color.s,
            l: color.l - color.l * asDecimalRatio(v, 0.1),
            a: color.a,
        });
    },
    rotateHue: (c, v) => {
        const color = asColor(c);
        if (color) {
            if (!v || (!isAngle(v) && !isFloat(v))) {
                return color;
            }
            else {
                return new Color({
                    h: (color.h + asDegree(v) + 360) % 360,
                    s: color.s,
                    l: color.l,
                    a: color.a,
                });
            }
        }
        return undefined;
    },
    complement: (c) => {
        const color = asColor(c);
        if (color) {
            return new Color({
                h: (color.h + 180) % 360,
                s: color.s,
                l: color.l,
                a: color.a,
            });
        }
        return undefined;
    },
    contrast: (base, dark, light) => {
        const baseColor = asColor(base);
        const darkColor = asColor(dark) || blackColor;
        const lightColor = asColor(light) || whiteColor;
        let darkContrast, lightContrast;
        const baseLuma = baseColor.luma();
        const darkLuma = darkColor.luma();
        const lightLuma = lightColor.luma();
        if (baseLuma > darkLuma) {
            darkContrast = (baseLuma + 0.05) / (darkLuma + 0.05);
        }
        else {
            darkContrast = (darkLuma + 0.05) / (baseLuma + 0.05);
        }
        if (baseLuma > lightLuma) {
            lightContrast = (baseLuma + 0.05) / (lightLuma + 0.05);
        }
        else {
            lightContrast = (lightLuma + 0.05) / (baseLuma + 0.05);
        }
        return darkContrast > lightContrast ? darkColor : lightColor;
    },
    rgba: (r, g, b, a) => FUNCTIONS.rgb(r, g, b, a),
    hsla: (h, s, l, a) => FUNCTIONS.hsl(h, s, l, a),
    tint: (c, w) => FUNCTIONS.mix(whiteColor, c, (w !== null && w !== void 0 ? w : new Float(0.1))),
    shade: (c, w) => FUNCTIONS.mix(blackColor, c, (w !== null && w !== void 0 ? w : new Float(0.1))),
    scale: (arg1, arg2, arg3, arg4) => {
        return scaleColor(arg1, arg2, arg3, arg4);
    },
};
const colorFunctions = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'grey', 'lab'];
const FUNCTION_ARGUMENTS = {
    calc: 'any',
    rgb: 'float|percentage, float|percentage, float|percentage,float|percentage|none',
    rgba: 'float|percentage, float|percentage, float|percentage,float|percentage|none',
    hsl: 'float|angle, float|percentage, float|percentage, float|percentage|none',
    hsla: 'float|angle, float|percentage, float|percentage, float|percentage|none',
    hsv: 'float|angle, float|percentage, float|percentage, float|percentage|none',
    hwb: 'float|angle, float|percentage, float|percentage, float|percentage|none',
    gray: 'float|percentage, float|percentage|none',
    min: 'any, any',
    max: 'any, any',
    clamp: 'any, any, any',
    mix: 'color, color, float|percentage|none, string|none',
    saturate: 'color, float|percentage|none',
    desaturate: 'color, float|percentage|none',
    lighten: 'color, float|percentage|none',
    darken: 'color, float|percentage|none',
    rotateHue: 'color, angle|float|none',
    complement: 'color',
    contrast: 'color, color|none, color|none',
    tint: 'color, float|percentage|none',
    shade: 'color, float|percentage|none',
};
function validateArguments(fn, args) {
    var _a;
    const expectedArguments = (_a = FUNCTION_ARGUMENTS[fn]) === null || _a === void 0 ? void 0 : _a.split(',').map(x => x.trim());
    if (expectedArguments) {
        expectedArguments.forEach((x, i) => {
            var _a;
            const types = x.split('|').map(x => x.trim());
            if (!types.includes('none') && !args[i]) {
                throw new SyntaxError(ErrorCode.MissingArgument, String(i + 1), fn, types.join(', '));
            }
            if (args[i] &&
                !types.includes('any') &&
                !types.includes((_a = args[i]) === null || _a === void 0 ? void 0 : _a.type())) {
                throw new SyntaxError(ErrorCode.ExpectedArgument, String(i + 1), fn, types.join(', '));
            }
        });
        if (args.length > expectedArguments.length) {
            throw new SyntaxError(ErrorCode.TooManyArguments, fn, expectedArguments.join(', '));
        }
    }
}
class Stream {
    constructor(s, options = {}) {
        this.s = '';
        this.index = 0;
        this.options = {};
        this.s = s;
        this.index = 0;
        this.options = options;
    }
    isEOF() {
        return this.index >= this.s.length;
    }
    lookAhead(n) {
        return this.s.slice(this.index, this.index + n);
    }
    skipWhiteSpace() {
        this.match(/^\s*/);
    }
    match(target) {
        if (typeof target === 'string') {
            if (this.lookAhead(target.length) === target) {
                this.index += target.length;
                return target;
            }
        }
        else {
            const m = this.s.slice(this.index).match(target);
            if (m && m[0]) {
                this.index += m[0].length;
                return m[1] || true;
            }
        }
        return undefined;
    }
    error(code, ...args) {
        var _a, _b, _c, _d;
        const prefix = (_b = (_a = this.s.slice(0, this.index).match(/^(.*)/)) === null || _a === void 0 ? void 0 : _a[1], (_b !== null && _b !== void 0 ? _b : ''));
        const suffix = (_d = (_c = this.s.slice(this.index).match(/(.*)$/)) === null || _c === void 0 ? void 0 : _c[1], (_d !== null && _d !== void 0 ? _d : ''));
        throwErrorWithContext([prefix + terminal.dim(suffix), ' '.repeat(prefix.length) + '⇧'], code, ...args);
    }
    applyOpToLength(op, lhs, rhs) {
        if (isFloat(lhs) && op === '/')
            this.error(ErrorCode.InvalidOperand);
        if (!isFloat(lhs) && !isFloat(rhs) && op === '*')
            this.error(ErrorCode.InvalidOperand);
        const opFn = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
        }[op];
        if (isFloat(lhs)) {
            assertLength(rhs);
            if (rhs.unit === 'multi') {
                const multiLength = {};
                Object.keys(rhs.value).forEach(unit => {
                    multiLength[unit] = opFn(lhs.value, rhs.value[unit]);
                });
                return new Length(multiLength);
            }
            return new Length(opFn(lhs.value, rhs.value), rhs.unit);
        }
        if (isFloat(rhs)) {
            if (typeof lhs.value === 'number') {
                return new Length(opFn(lhs.value, rhs.value), lhs.unit);
            }
            const multiLength = {};
            Object.keys(lhs.value).forEach(unit => {
                multiLength[unit] = opFn(lhs.value[unit], rhs.value);
            });
            return new Length(multiLength);
        }
        if (op === '/') {
            if (lhs.unit === 'multi' || rhs.unit === 'multi') {
                this.error(ErrorCode.InvalidOperand);
            }
            if (lhs.unit === rhs.unit) {
                return new Float(lhs.value / rhs.value);
            }
            else {
                return new Float(lhs.canonicalScalar() / rhs.canonicalScalar());
            }
        }
        const lhsMulti = promoteToMulti(lhs);
        const rhsMulti = promoteToMulti(rhs);
        const multiLength = {};
        [
            ...Object.keys(lhsMulti.value),
            ...Object.keys(rhsMulti.value),
        ].forEach(unit => {
            if (typeof rhsMulti.value[unit] === 'undefined') {
                multiLength[unit] = lhsMulti.value[unit];
            }
            else if (typeof lhsMulti.value[unit] === 'undefined') {
                multiLength[unit] = rhsMulti.value[unit];
            }
            else {
                multiLength[unit] = opFn(lhsMulti.value[unit], rhsMulti.value[unit]);
            }
        });
        return new Length(multiLength);
    }
    parseUnit(num) {
        if (this.match('%')) {
            return new Percentage(num);
        }
        let unit = this.match(/^(em|ex|ch|rem|vw|vh|vmin|vmax|px|cm|mm|in|pt|pc|Q)/);
        if (unit) {
            return new Length(num, unit);
        }
        unit = this.match(/^(deg|°|rad|grad|turn)/);
        if (unit) {
            return new Angle(num, (unit === '°' ? 'deg' : unit));
        }
        unit = this.match(/^(ms|s)/);
        if (unit) {
            return new Time(num, unit);
        }
        unit = this.match(/^(khz|hz|kHz|Hz)/);
        if (unit) {
            return new Frequency(num, unit.toLowerCase());
        }
        unit = this.match(/^([a-zA-Z]+)/);
        if (unit) {
            this.error(ErrorCode.UnknownUnit, unit);
        }
        return new Float(num);
    }
    parseIndex(v) {
        let result = v;
        if (this.match('[')) {
            if (v.type() !== 'array') {
                this.error(ErrorCode.UnexpectedOpenBracket);
            }
            else {
                const index = asInteger(this.parseExpression(), NaN);
                if (isNaN(index))
                    this.error(ErrorCode.ExpectedIntegerIndex);
                result = v.get(index);
                this.skipWhiteSpace();
                if (!this.match(']')) {
                    this.error(ErrorCode.ExpectedCloseBracket);
                }
            }
        }
        return result;
    }
    parseLiteral() {
        var _a, _b, _c;
        let result;
        const saveIndex = this.index;
        const op = this.match(/^\s*([+\-])\s*/);
        if (op) {
            const operand = this.parseLiteral();
            if (op === '-') {
                if (isPercentage(operand)) {
                    return new Percentage(-100 * asPercent(operand));
                }
                if (isFloat(operand)) {
                    return new Float(-operand.value);
                }
                if (isAngle(operand)) {
                    return new Angle(-operand.value, operand.unit);
                }
                if (isLength(operand)) {
                    return this.applyOpToLength('-', new Length(0, 'px'), operand);
                }
                this.error(ErrorCode.InvalidUnaryOperand);
            }
            return operand;
        }
        const num = this.match(/^([0-9]*\.[0-9]+|\.?[0-9]+)/);
        if (num) {
            result = this.parseUnit(parseFloat(num));
        }
        if (!result && this.match('[')) {
            const array = [];
            while (this.lookAhead(1) !== ']' && !this.isEOF()) {
                const element = this.parseExpression();
                if (!element) {
                    this.error(ErrorCode.SyntaxError);
                }
                array.push(element);
                this.match(/^(\s*,?|\s+)/);
            }
            if (this.isEOF()) {
                this.error(ErrorCode.ExpectedCloseBracket);
            }
            this.match(']');
            return new ArrayValue(array);
        }
        if (!result && this.match('"')) {
            let s = '';
            while (this.lookAhead(1) !== '"' && !this.isEOF()) {
                if (this.lookAhead(1) === '\\') {
                    s += this.s[this.index + 1];
                    this.index += 2;
                }
                else {
                    s += this.s[this.index];
                    this.index += 1;
                }
            }
            if (this.isEOF()) {
                this.error(ErrorCode.ExpectedQuote);
            }
            this.match('"');
            return new StringValue(s);
        }
        if (!result && this.match('{')) {
            const identifier = this.match(/^([a-zA-Z0-9\._-]+)/);
            if (identifier) {
                let alias = (_a = this.options) === null || _a === void 0 ? void 0 : _a.aliasResolver(identifier);
                if (typeof alias === 'string') {
                    const m = identifier.match(/^(.+)-([0-9]{2,3})$/);
                    if (m) {
                        const color = (_b = this.options) === null || _b === void 0 ? void 0 : _b.aliasResolver(m[1]);
                        if (typeof color !== 'string' && isColor(color)) {
                            const index = Math.round(parseInt(m[2]) / 100);
                            alias = (_c = scaleColor(color)) === null || _c === void 0 ? void 0 : _c.get(index);
                        }
                        else if (typeof color === 'string') {
                            this.error(ErrorCode.UnknownToken, m[1], color);
                        }
                        else
                            this.error(ErrorCode.InvalidOperand);
                    }
                }
                if (typeof alias === 'string') {
                    this.error(ErrorCode.UnknownToken, identifier, alias);
                }
                result = alias;
                if (result) {
                    result = makeValueFrom(result);
                    result.setSource('{' + identifier + '}');
                }
            }
            this.match('}');
        }
        if (!result) {
            result = asColor(this.match(/^\s*(#[0-9a-fA-F]{3,8})/));
        }
        if (!result) {
            this.index = saveIndex;
            result = asColor(this.match(/^\s*([a-zA-Z]+)/));
        }
        if (!result) {
            this.index = saveIndex;
        }
        return result;
    }
    parseColorArguments() {
        const result = [];
        this.skipWhiteSpace();
        if (!this.match('('))
            return undefined;
        let arg = this.parseExpression();
        if (arg) {
            result.push(arg);
            if (!this.match(/^(\s*,?|\s+)/)) {
                this.match(')');
                return result;
            }
            arg = this.parseExpression();
            if (arg) {
                result.push(arg);
                if (!this.match(/^(\s*,?|\s+)/)) {
                    this.match(')');
                    return result;
                }
                arg = this.parseExpression();
                if (arg) {
                    result.push(arg);
                    if (!this.match(/^(\s*,?|\s+|\s*\/)/)) {
                        this.match(')');
                        return result;
                    }
                    arg = this.parseExpression();
                    if (arg) {
                        result.push(arg);
                    }
                }
            }
        }
        this.match(')');
        return result;
    }
    parseArguments() {
        this.skipWhiteSpace();
        if (!this.match('('))
            return undefined;
        const result = [];
        while (this.lookAhead(1) !== ')' && !this.isEOF()) {
            const argument = this.parseExpression();
            if (!argument) {
                this.error(ErrorCode.SyntaxError);
            }
            result.push(argument);
            this.match(/^(\s*,?|\s+)/);
        }
        if (this.isEOF()) {
            this.error(ErrorCode.ExpectedCloseParen);
        }
        this.match(')');
        return result;
    }
    parseCall() {
        const saveIndex = this.index;
        const fn = this.match(/^([a-zA-Z\-]+)/);
        if (fn) {
            if (!FUNCTIONS[fn]) {
                if (this.lookAhead(1) === '(') {
                    this.error(ErrorCode.UnknownFunction, fn, getSuggestion(fn, FUNCTIONS));
                }
            }
            else {
                const args = colorFunctions.includes(fn)
                    ? this.parseColorArguments()
                    : this.parseArguments();
                if (args) {
                    try {
                        validateArguments(fn, args);
                    }
                    catch (err) {
                        if (err.code) {
                            this.error(err.code, ...err.args);
                        }
                        else {
                            this.error(err.message);
                        }
                    }
                    return FUNCTIONS[fn](...args);
                }
                else {
                    this.error(ErrorCode.SyntaxError);
                }
            }
        }
        this.index = saveIndex;
        return undefined;
    }
    parseTerminal() {
        const result = this.parseCall() || this.parseGroup() || this.parseLiteral();
        if (!result)
            return result;
        return this.parseIndex(result);
    }
    parseFactor() {
        let lhs = this.parseTerminal();
        let op = this.match(/^\s*([*|/])\s*/);
        while (op) {
            const opFn = {
                '*': (a, b) => a * b,
                '/': (a, b) => a / b,
            }[op];
            const rhs = this.parseTerminal();
            if (!rhs)
                this.error(ErrorCode.ExpectedOperand);
            if (isFloat(rhs)) {
                if (isFloat(lhs)) {
                    lhs = new Float(opFn(lhs.value, rhs.value));
                }
                else if (isPercentage(lhs)) {
                    lhs = new Percentage(opFn(lhs.value, rhs.value));
                }
                else if (isLength(lhs)) {
                    lhs = this.applyOpToLength(op, lhs, rhs);
                }
                else if (isAngle(lhs)) {
                    lhs = new Angle(opFn(lhs.value, rhs.value), lhs.unit);
                }
                else if (isFrequency(lhs)) {
                    lhs = new Frequency(opFn(lhs.value, rhs.value), lhs.unit);
                }
                else if (isTime(lhs)) {
                    lhs = new Time(opFn(lhs.value, rhs.value), lhs.unit);
                }
            }
            else if ((isFloat(lhs) || isLength(lhs)) && isLength(rhs)) {
                return this.applyOpToLength(op, lhs, rhs);
            }
            else if (isFloat(lhs)) {
                if (isPercentage(rhs)) {
                    lhs = new Percentage(opFn(lhs.value, rhs.value));
                }
                else if (isLength(rhs)) {
                    lhs = this.applyOpToLength(op, lhs, rhs);
                }
                else if (isAngle(rhs)) {
                    lhs = new Angle(opFn(lhs.value, rhs.value), rhs.unit);
                }
                else if (isFrequency(rhs)) {
                    lhs = new Frequency(opFn(lhs.value, rhs.value), rhs.unit);
                }
                else if (isTime(rhs)) {
                    lhs = new Time(opFn(lhs.value, rhs.value), rhs.unit);
                }
            }
            else if (op === '/' && lhs.type() === rhs.type()) {
                lhs = new Float(lhs.canonicalScalar() / rhs.canonicalScalar());
            }
            else {
                this.error(ErrorCode.InvalidOperand);
            }
            op = this.match(/^\s*([*|/])\s*/);
        }
        return lhs;
    }
    parseTerm() {
        let lhs = this.parseFactor();
        let op = this.match(/^\s*([+\-])\s*/);
        while (op) {
            const opFn = {
                '+': (a, b) => a + b,
                '-': (a, b) => a - b,
            }[op];
            const rhs = this.parseFactor();
            if (!rhs)
                this.error(ErrorCode.ExpectedOperand);
            if (isString(lhs) || isString(rhs)) {
                if (op === '-')
                    this.error(ErrorCode.InvalidOperand);
                lhs = new StringValue(opFn(lhs.css(), rhs.css()));
            }
            else if (isFloat(lhs) && isFloat(rhs)) {
                lhs = new Float(opFn(lhs.value, rhs.value));
            }
            else if ((isZero(lhs) || isPercentage(lhs)) &&
                (isZero(rhs) || isPercentage(rhs))) {
                lhs = new Percentage(100 * opFn(asPercent(lhs), asPercent(rhs)));
            }
            else if (isZero(lhs) && isTime(rhs)) {
                lhs = new Time(opFn(0, rhs.value), rhs.unit);
            }
            else if (isTime(lhs) && isZero(rhs)) {
                lhs = new Time(lhs.value, lhs.unit);
            }
            else if (isTime(lhs) && isTime(rhs)) {
                if (lhs.unit === rhs.unit) {
                    lhs = new Time(opFn(lhs.value, rhs.value), lhs.unit);
                }
                else {
                    lhs = new Time(opFn(lhs.canonicalScalar(), rhs.canonicalScalar()), 's');
                }
            }
            else if (isZero(lhs) && isFrequency(rhs)) {
                lhs = new Frequency(opFn(0, rhs.value), rhs.unit);
            }
            else if (isFrequency(lhs) && isZero(rhs)) {
                lhs = new Frequency(lhs.value, lhs.unit);
            }
            else if (isFrequency(lhs) && isFrequency(rhs)) {
                if (lhs.unit === rhs.unit) {
                    lhs = new Frequency(opFn(lhs.value, rhs.value), lhs.unit);
                }
                else {
                    lhs = new Frequency(opFn(lhs.canonicalScalar(), rhs.canonicalScalar()), 'hz');
                }
            }
            else if (isZero(lhs) && isAngle(rhs)) {
                lhs = new Angle(opFn(0, rhs.value), rhs.unit);
            }
            else if (isAngle(lhs) && isZero(rhs)) {
                lhs = new Angle(lhs.value, lhs.unit);
            }
            else if (isAngle(lhs) && isAngle(rhs)) {
                if (lhs.unit === rhs.unit) {
                    lhs = new Angle(opFn(lhs.value, rhs.value), lhs.unit);
                }
                else {
                    lhs = new Angle(opFn(asDegree(lhs), asDegree(rhs)), 'deg');
                }
            }
            else if ((isZero(lhs) || isLength(lhs)) &&
                (isZero(rhs) || isLength(rhs))) {
                lhs = this.applyOpToLength(op, lhs, rhs);
            }
            else {
                this.error(ErrorCode.InvalidOperand);
            }
            op = this.match(/^\s*([+\-])\s*/);
        }
        return lhs;
    }
    parseGroup() {
        let result;
        if (this.match('(')) {
            result = this.parseExpression();
            this.skipWhiteSpace();
            if (!this.match(')')) {
                this.error(ErrorCode.ExpectedCloseParen);
            }
        }
        if (result && isFloat(result)) {
            result = this.parseUnit(result.value);
        }
        return result;
    }
    parseExpression() {
        this.skipWhiteSpace();
        return this.parseTerm();
    }
}
function parseValue(expression, options = {}) {
    const stream = new Stream(expression, options);
    const result = stream.parseExpression();
    stream.skipWhiteSpace();
    if (!stream.isEOF()) {
        return undefined;
    }
    result.setSource(expression);
    return result;
}

const GenericFormats = {
    formats: {
        yaml: {
            ext: '.yaml',
            renderFile: (context) => (!context.header
                ? ''
                : '# ' + context.header.split('\n').join('\n# ')) +
                '\ntokens:\n' +
                context.content,
            renderGroup: (context) => '\t' + context.properties.join('\n\t'),
            renderProperty: (context) => `${!context.definition.comment
                ? ''
                : '# ' + context.definition.comment + '\n\t'}${context.propertyName}: "${context.propertyValue.replace(/"/g, '\\"')}"`,
        },
        json: {
            ext: '.json',
            renderFile: (context) => context.content,
            renderGroup: (context) => '{\n\t' + context.properties.join(',\n\t') + '\n}',
            renderProperty: (context) => `"${context.propertyName}": "${context.propertyValue}"`,
        },
    },
};
//# sourceMappingURL=formats-generic.js.map

function sanitizePropertyNameForCSS(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, '-');
}
function renderSassProperty(context) {
    return `${!context.definition.comment
        ? ''
        : '// ' + context.definition.comment + '\n'}\$${sanitizePropertyNameForCSS(context.propertyName)}: ${context.propertyValue} !default;`;
}
function renderCssCustomProperty(context) {
    return `--${sanitizePropertyNameForCSS(context.propertyName)}: ${context.propertyValue};`;
}
function renderSassGroup(context) {
    let result = '';
    const themedTokens = {};
    const nonThemedTokens = [];
    context.definitions.forEach((def, token) => {
        if (Object.keys(def.value).length > 1) {
            Object.keys(def.value).forEach(theme => {
                if (!themedTokens[theme])
                    themedTokens[theme] = [];
                themedTokens[theme].push(token);
            });
        }
        else {
            nonThemedTokens.push(token);
        }
    });
    Object.keys(themedTokens).forEach(theme => {
        const customProperties = themedTokens[theme]
            .map(token => renderCssCustomProperty(Object.assign(Object.assign({}, context), { theme: theme, category: '', token: token, definition: context.definitions.get(token), propertyName: token, propertyValue: context.values.get(token + (theme === '_' ? '' : '.' + theme)) })))
            .join('\n\t');
        if (theme === '_') {
            result += `:root {\n\t${customProperties}\n}\n`;
        }
        else {
            result += `body[data-theme="${theme}"] {\n\t${customProperties}\n}\n`;
        }
    });
    result += nonThemedTokens
        .map(token => renderSassProperty(Object.assign(Object.assign({}, context), { category: '', theme: '', token: token, definition: context.definitions.get(token), propertyName: token, propertyValue: context.values.get(token) })))
        .join('\n');
    return result;
}
const WebFormats = {
    formats: {
        sass: {
            ext: '.scss',
            renderFile: (context) => (!context.header
                ? ''
                : '/* ' +
                    context.header.split('\n').join('\n * ') +
                    '\n */\n\n') + context.content,
            renderProperty: renderSassProperty,
            renderGroup: renderSassGroup,
        },
        plist: {
            ext: '.plist',
            renderFile: (context) => `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n\n` +
                (context.header
                    ? '<!-- \n' + context.header + '\n-->\n\n'
                    : '') +
                context.content,
            renderGroup: (context) => `<plist version="1.0"><dict>\n\t${context.properties.join('\n\t')}\n</dict></plist>`,
            renderProperty: (context) => `${context.definition.comment
                ? '<!-- ' + context.definition.comment + ' -->\n\t'
                : ''}<key>${context.propertyName}</key>\n\t<string>${context.propertyValue}</string> `,
            valueFormatters: ['color/plist'],
        },
    },
};
//# sourceMappingURL=formats-web.js.map

const marked = require('marked');
const highlight = require('highlight.js');
const handlebars = require('handlebars');
const fs = require('fs');
function renderFragment(context) {
    let result = '';
    const handlebarsContext = { colors: [], group: '' };
    context.themes.forEach(theme => {
        handlebarsContext.group =
            context.themes.length === 1 ? '' : theme === '_' ? 'Base' : theme;
        handlebarsContext.colors = [];
        context.definitions.forEach((def, token) => {
            var _a, _b;
            if (def.value[theme]) {
                const qualifiedToken = token + (theme === '_' ? '' : '.' + theme);
                const value = context.rawValues.get(qualifiedToken);
                if (value.type() === 'color') {
                    const color = value;
                    let cls = color.luma() >= 1.0 ? 'frame ' : '';
                    if (color.luma() > 0.42)
                        cls += 'light';
                    let opaqueColor;
                    if (color.a < 1.0) {
                        opaqueColor = new Color(color);
                        opaqueColor.a = 1.0;
                    }
                    handlebarsContext.colors.push({
                        name: token,
                        def: def.value,
                        source: color.getSource(),
                        value: color.css(),
                        comment: (_a = def.comment, (_a !== null && _a !== void 0 ? _a : '')),
                        cls: cls,
                        opaqueColor: (_b = opaqueColor) === null || _b === void 0 ? void 0 : _b.css(),
                    });
                }
            }
        });
        result += handlebars.compile(fs.readFileSync(__dirname + '/templates/html-colors.hbs', 'utf-8'))(handlebarsContext);
    });
    if (result) {
        result = '<h2>Colors</h2>' + result;
    }
    return result;
}
function renderFile(context) {
    return handlebars.compile(fs.readFileSync(__dirname + '/templates/html-file.hbs', 'utf-8'))(context);
}
function renderGroup(context) {
    return renderFragment(context);
}
function renderProperty(context) {
    let result = '';
    result += `<b>${context.propertyName}</b>: ${context.propertyValue}`;
    if (context.definition.comment) {
        result += `<p>${context.definition.comment}</p>`;
    }
    if (context.definition.remarks) {
        result += marked(context.definition.remarks);
    }
    return result;
}
const StyleGuideFormat = {
    formats: {
        'html/fragment': {
            ext: '.html',
            renderFile: renderFragment,
            renderGroup: renderGroup,
            renderProperty: renderProperty,
        },
        html: {
            extends: 'html/fragment',
            renderFile: renderFile,
        },
    },
};
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
});

const { cosmiconfigSync } = require('cosmiconfig');
const configParser = cosmiconfigSync('chromatic');
const glob = require('glob');
const fs$1 = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const json5 = require('json5');
const resolveFrom = require('resolve-from');
const gConfig = {};
let gWatching = false;
let gIgnoreErrors = false;
let gThemes;
let gTokenDefinitions;
let gTokenValues;
let gRecursiveEvaluationStack;
let gProcessedFiles;
function error(m) {
    var _a;
    if (typeof m === 'string')
        m = [m];
    const msg = '\n' + [].concat(...m.map(x => x.split('\n'))).join('\n    ');
    (_a = gConfig.console) === null || _a === void 0 ? void 0 : _a.error(terminal.autoFormat(msg));
    if (!gWatching && !gIgnoreErrors) {
        process.exit(1);
    }
}
function log(m) {
    var _a;
    (_a = gConfig.console) === null || _a === void 0 ? void 0 : _a.log(m);
}
function mergeObject(object, source) {
    if (object === source)
        return;
    if (!source)
        return;
    Object.keys(source).forEach(key => {
        if (Array.isArray(source[key])) {
            if (!object[key])
                object[key] = [];
            object[key] = [...object[key], ...source[key]];
        }
        else if (typeof source[key] === 'object') {
            if (!object[key])
                object[key] = {};
            mergeObject(object[key], source[key]);
        }
        else if (typeof source[key] !== 'undefined') {
            object[key] = source[key];
        }
    });
}
function normalizeToken(defaultTheme, entry) {
    if (typeof entry !== 'string' &&
        (typeof entry !== 'object' || !entry.value)) {
        return undefined;
    }
    let result = { value: {} };
    if (typeof entry === 'string') {
        result.value._ = entry;
    }
    else {
        result = Object.assign({}, entry);
    }
    if (typeof result.value === 'string') {
        result.value = { _: result.value };
    }
    if (defaultTheme && result.value['_']) {
        result.value[defaultTheme] = result.value['_'];
        result.value['_'] = undefined;
    }
    Object.keys(result.value).forEach(theme => {
        if (!gThemes.includes(theme)) {
            gThemes.push(theme);
        }
    });
    return result;
}
function evaluateTokenExpression(qualifiedToken, expression) {
    if (!expression)
        return undefined;
    if (gRecursiveEvaluationStack.includes(qualifiedToken)) {
        throwError(ErrorCode.CircularDefinition, qualifiedToken);
    }
    gRecursiveEvaluationStack.push(qualifiedToken);
    const result = parseValue(expression, Object.assign(Object.assign({}, gConfig), { aliasResolver: (identifier) => {
            var _a, _b;
            if (gTokenValues.has(identifier))
                return gTokenValues.get(identifier);
            let aliasValue;
            if (gTokenDefinitions.has(identifier)) {
                if (gConfig.defaultTheme) {
                    aliasValue = evaluateTokenExpression(identifier + '.' + gConfig.defaultTheme, (_a = gTokenDefinitions.get(identifier)) === null || _a === void 0 ? void 0 : _a.value[gConfig.defaultTheme]);
                }
                if (!aliasValue) {
                    aliasValue = evaluateTokenExpression(identifier, (_b = gTokenDefinitions.get(qualifiedToken)) === null || _b === void 0 ? void 0 : _b.value['_']);
                }
            }
            return (aliasValue !== null && aliasValue !== void 0 ? aliasValue : getSuggestion(identifier, gTokenDefinitions));
        } }));
    gRecursiveEvaluationStack.pop();
    return result;
}
function processTokenGroup(tokenFile, tokenPath, tokens) {
    if (Array.isArray(tokens)) {
        throwError(ErrorCode.UnexpectedTokensArray, terminal.link('tokens-as-array'));
    }
    Object.keys(tokens).forEach(token => {
        var _a;
        const qualifiedToken = (tokenPath ? tokenPath + '.' : '') + token;
        if (!/^[a-zA-Z0-9_-]+$/.test(token)) {
            throwError(ErrorCode.InvalidTokenName, qualifiedToken);
        }
        if (!tokens[token]) {
            throwError(ErrorCode.InvalidTokenValue, token);
        }
        try {
            const normalizedToken = normalizeToken((_a = tokenFile.theme, (_a !== null && _a !== void 0 ? _a : gConfig.defaultTheme)), tokens[token]);
            if (!normalizedToken) {
                processTokenGroup(tokenFile, qualifiedToken, tokens[token]);
            }
            else {
                if (!gTokenDefinitions.has(qualifiedToken)) {
                    gTokenDefinitions.set(qualifiedToken, normalizedToken);
                }
                else {
                    if (normalizedToken.type &&
                        gTokenDefinitions.get(qualifiedToken).type &&
                        gTokenDefinitions.get(qualifiedToken).type !==
                            normalizedToken.type) {
                        throwError(ErrorCode.InconsistentTokenType, normalizedToken.type, gTokenDefinitions.get(qualifiedToken).type);
                    }
                    const mergedToken = gTokenDefinitions.get(qualifiedToken);
                    mergeObject(mergedToken, normalizedToken);
                    gTokenDefinitions.set(qualifiedToken, mergedToken);
                }
            }
        }
        catch (err) {
            throw new Error(`${qualifiedToken}: "${tokens[token]}"\n${err.message}`);
        }
    });
}
function processPath(f) {
    var _a, _b;
    const errors = [];
    f = path.resolve(path.normalize(f));
    if (gProcessedFiles.includes(f))
        return;
    gProcessedFiles.push(f);
    if (fs$1.lstatSync(f).isDirectory()) {
        glob.sync(f + '/**/*.' + gConfig.tokenFileExt).forEach(processPath);
        return;
    }
    let tokenFile;
    try {
        const content = fs$1.readFileSync(f, 'utf8');
        if (/^\.json/.test(path.extname(f))) {
            tokenFile = json5.parse(content);
        }
        else {
            tokenFile = yaml.parse(content);
        }
    }
    catch (err) {
        errors.push((err.name ? err.name + ': ' : '') + err.message);
    }
    if ((_a = tokenFile) === null || _a === void 0 ? void 0 : _a.import) {
        if (typeof tokenFile.import === 'string') {
            tokenFile.import = [tokenFile.import];
        }
        if (Array.isArray(tokenFile.import)) {
            tokenFile.import.forEach((x) => {
                let resolvedPath = f;
                try {
                    resolvedPath = resolveFrom(path.parse(f).dir, x);
                    processPath(resolvedPath);
                }
                catch (err) {
                    errors.push(`option "import: ${x}"`);
                    if (err.code === 'MODULE_NOT_FOUND') {
                        errors.push('Module not found.' +
                            (x.slice(0, 2) === './'
                                ? ''
                                : `\nTo import as a file, use a relative path: "./${x}"`));
                    }
                    else if (err.code === 'ENOENT') {
                        errors.push('→ ' +
                            terminal.path(resolvedPath) +
                            '\nFile not found.');
                    }
                    else {
                        errors.push(err.message);
                    }
                }
            });
        }
        else {
            errors.push('Option "import" should be a path or an array of paths');
        }
    }
    if (tokenFile && gConfig.verbose) {
        if ((tokenFile['imports'] ||
            tokenFile['extends'] ||
            tokenFile['include'] ||
            tokenFile['includes']) &&
            !tokenFile.import) {
            log(terminal.warning() +
                terminal.path(path.relative('', f)) +
                `\n${terminal.warning('Warning:')} use the \`"import"\` property to import other token files`);
        }
    }
    if ((_b = tokenFile) === null || _b === void 0 ? void 0 : _b.tokens) {
        try {
            if (typeof tokenFile.tokens !== 'object') {
                throwError(ErrorCode.UnexpectedTokensType);
            }
            else {
                processTokenGroup(tokenFile, '', tokenFile.tokens);
            }
        }
        catch (err) {
            errors.push(err.message);
        }
    }
    if (gConfig.verbose && errors.length === 0) {
        log(terminal.success() +
            '← ' +
            terminal.path(process.env.TEST ? path.basename(f) : path.relative('', f)));
    }
    if (errors.length > 0) {
        error([
            terminal.error() +
                terminal.path(process.env.TEST ? path.basename(f) : path.relative('', f)),
            ...errors,
        ]);
    }
}
function formatTokenValues(tokens, valueFormatter) {
    if (!valueFormatter)
        return undefined;
    const result = new Map();
    tokens.forEach(token => {
        try {
            result.set(token, valueFormatter(gTokenValues.get(token)));
        }
        catch (err) {
            error([
                terminal.error(`Error formatting "${gTokenValues
                    .get(token)
                    .css()}" for the "${token}" token`),
                err.message,
            ]);
        }
    });
    return result;
}
function areThemesValid() {
    var _a;
    if (((_a = gConfig.themes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        gThemes = gThemes.filter(x => gConfig.themes.includes(x));
    }
    gThemes.forEach(theme => {
        let count = 0;
        gTokenDefinitions.forEach((entry, _token) => {
            if (typeof entry.value[theme] !== 'undefined') {
                count += 1;
            }
        });
        if (count === 0) {
            gThemes.splice(gThemes.indexOf(theme), 1);
        }
    });
    if (gThemes.length === 0 || gTokenDefinitions.size === 0) {
        error([
            terminal.error('No tokens found.'),
            `Token files should have a "${'tokens'}" property`,
            terminal.link('../guide'),
        ]);
        return false;
    }
    return true;
}
function setFormat(formatName) {
    const result = {
        fileHeader: DEFAULT_FILE_HEADER,
        renderFilename: function ({ theme, basename, }) {
            return basename + (!theme ? '' : '-' + theme);
        },
        renderGroup: (context) => context.properties.join('\n'),
        renderFile: (context) => context.content,
    };
    if (!gConfig.formats[formatName]) {
        throwError(ErrorCode.UnknownFormat, formatName, getSuggestion(formatName, gConfig.formats));
    }
    const baseFormat = gConfig.formats[formatName].extends;
    if (typeof baseFormat === 'string') {
        if (gConfig.formats[baseFormat]) {
            mergeObject(result, gConfig.formats[baseFormat]);
            mergeObject(result, gConfig.formats[formatName]);
        }
        else {
            throwError(ErrorCode.UnknownFormat, formatName, getSuggestion(formatName, gConfig.formats));
        }
    }
    else {
        mergeObject(result, gConfig.formats[formatName]);
    }
    if (typeof result.valueFormatter === 'string') {
        if (!gConfig.valueFormatters[result.valueFormatter]) {
            throwError(ErrorCode.UnknownValueFormatter, result.valueFormatter, getSuggestion(result.valueFormatter, gConfig.valueFormatters));
        }
    }
    else if (typeof result.valueFormatter !== 'function') {
        result.valueFormatter = (v) => v.css();
    }
    if (typeof result.nameFormatter === 'string') {
        if (!gConfig.nameFormatters[result.nameFormatter]) {
            throwError(ErrorCode.UnknownNameFormatter, result.nameFormatter, getSuggestion(result.nameFormatter, gConfig.nameFormatters));
        }
    }
    else if (typeof result.nameFormatter !== 'function') {
        result.nameFormatter = (n, theme) => n + (!theme || theme === '_' ? '' : '-' + theme);
    }
    if (typeof result.renderProperty !== 'function') {
        if (gConfig.verbose) {
            log(terminal.warning('Warning: ') +
                ` the "${formatName}" format does not have a \`propertyTemplate\` function`);
        }
        result.renderProperty = (context) => `${context.propertyName}${context.theme ? '-' + context.theme : ''}: ${context.propertyValue}`;
    }
    return result;
}
function renderFile$1(format, context) {
    const propertyNames = [];
    const tokens = [];
    gTokenDefinitions.forEach((def, token) => {
        Object.keys(def.value).forEach(tokenTheme => {
            if (context.themes.includes(tokenTheme)) {
                tokens.push(tokenTheme === '_' ? token : token + '.' + tokenTheme);
            }
        });
    });
    const formattedTokenValues = formatTokenValues(tokens, format.valueFormatter);
    formattedTokenValues.forEach((value, token) => {
        const newValue = value.replace(/{[a-zA-Z0-9_-]+}/g, match => {
            const alias = match.slice(1, -1);
            if (formattedTokenValues.has(alias)) {
                return formattedTokenValues.get(alias);
            }
            const msg = terminal.error('Unresolved alias. ') +
                `Cannot find token "${match}"` +
                getSuggestion(alias, formattedTokenValues);
            error(msg);
            return match;
        });
        if (newValue)
            formattedTokenValues.set(token, newValue);
    });
    const properties = [];
    context.themes.forEach(theme => {
        gTokenDefinitions.forEach((def, token) => {
            if (typeof def.value[theme] === 'undefined')
                return;
            const propertyName = format.nameFormatter(token, theme);
            if (propertyNames.includes(propertyName)) {
                if (propertyName !== token) {
                    log(terminal.warning('Warning: ') +
                        ` the "${token}" token has multiple definitions as "${propertyName}"`);
                }
                else {
                    log(terminal.warning('Warning: ') +
                        ` the "${token}" token has multiple definitions`);
                }
            }
            propertyNames.push(propertyName);
            const qualifiedToken = token + (theme === '_' ? '' : '.' + theme);
            properties.push(format.renderProperty(Object.assign(Object.assign({}, context), { theme: theme, category: '', properties: properties, values: formattedTokenValues, token: qualifiedToken, definition: def, propertyName: propertyName, propertyValue: formattedTokenValues.get(qualifiedToken) })));
        });
    });
    return format.renderFile(Object.assign(Object.assign({}, context), { content: format.renderGroup(Object.assign(Object.assign({}, context), { category: '', properties: properties, values: formattedTokenValues })) }));
}
function render(baseOutputPath, format) {
    var _a;
    const result = {};
    if (!areThemesValid())
        return;
    const pathRecord = (_a = (baseOutputPath && path.parse(baseOutputPath)), (_a !== null && _a !== void 0 ? _a : {
        name: 'tokens',
    }));
    const context = {
        filepath: '',
        themes: [],
        header: format.fileHeader,
        definitions: gTokenDefinitions,
        rawValues: gTokenValues,
        content: '',
    };
    if (gConfig.splitOutput) {
        gThemes.forEach(theme => {
            context.filepath = path.format({
                dir: pathRecord.dir,
                name: format.renderFilename({
                    theme: theme,
                    basename: pathRecord.name,
                }),
                ext: format.ext,
            });
            context.themes = [theme];
            result[context.filepath] = renderFile$1(format, context);
        });
    }
    else {
        context.filepath = path.format({
            dir: pathRecord.dir,
            name: format.renderFilename({
                theme: '',
                basename: pathRecord.name,
            }),
            ext: format.ext,
        });
        context.themes = gThemes;
        result[context.filepath] = renderFile$1(format, context);
    }
    return result;
}
function writeOutputFile(content, outputPath) {
    const dirname = path.dirname(outputPath);
    if (!fs$1.existsSync(dirname)) {
        fs$1.mkdirsSync(dirname);
    }
    fs$1.writeFileSync(outputPath, content);
    if (gConfig.verbose || gWatching) {
        log(terminal.success() +
            (gWatching ? terminal.time() + ' ' : '') +
            '→ ' +
            terminal.path(path.relative('', outputPath)));
    }
}
function build(paths, options) {
    var _a, _b, _c, _d, _e;
    gWatching = (_b = (_a = options) === null || _a === void 0 ? void 0 : _a.watching, (_b !== null && _b !== void 0 ? _b : false));
    gThemes = [];
    gTokenDefinitions = new Map();
    gTokenValues = new Map();
    gRecursiveEvaluationStack = [];
    gProcessedFiles = [];
    paths.forEach((x) => {
        const files = glob.sync(x);
        if (files.length === 0) {
            error(terminal.error('File not found: ') + terminal.path(x));
            return;
        }
        files.forEach(processPath);
    });
    gTokenDefinitions.forEach((def, token) => {
        Object.keys(def.value).forEach(theme => {
            const qualifiedToken = token + (theme === '_' ? '' : '.' + theme);
            let value;
            try {
                value = evaluateTokenExpression(qualifiedToken, def.value[theme]);
                if (!value) {
                    value = new StringValue(def.value[theme]);
                }
            }
            catch (err) {
                error([
                    terminal.error('Syntax error') +
                        ` in "${token + ": '" + def.value[theme]}\'"`,
                    err.message,
                ]);
                value = new StringValue(def.value[theme]);
            }
            gTokenValues.set(qualifiedToken, value);
            const actualType = value.type();
            if (def.type && actualType != def.type) {
                log(terminal.warning('Warning:') +
                    ` Type mismatch. Expected \`${def.type}\` but got \`${actualType}\` for "${qualifiedToken}" token`);
            }
        });
    });
    try {
        const format = setFormat(gConfig.outputFormat);
        format.fileHeader = (_c = options.header, (_c !== null && _c !== void 0 ? _c : format.fileHeader));
        const outputPath = ((_d = options) === null || _d === void 0 ? void 0 : _d.output) && path.resolve(options.output);
        const content = render(outputPath, format);
        if (content && !((_e = options) === null || _e === void 0 ? void 0 : _e.dryRun)) {
            if (!outputPath) {
                return content;
            }
            else {
                if (gConfig.verbose) {
                    let themesMessage = '';
                    if (gThemes.length !== 1 || gThemes[0] !== '_') {
                        if (gThemes.length === 1) {
                            themesMessage = `for theme "${gThemes[0]}"`;
                        }
                        else {
                            themesMessage =
                                'for themes ' +
                                    gThemes.map(x => '"' + x + '"').join(', ');
                        }
                    }
                    log(`    Writing ${terminal.string(gConfig.outputFormat)} format ${themesMessage}`);
                }
                Object.keys(content).forEach(file => {
                    writeOutputFile(content[file], file);
                });
            }
        }
    }
    catch (err) {
        error(terminal.error(err.message));
    }
    return {};
}
function chromatic(paths, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    if (typeof paths === 'string') {
        paths = [paths];
    }
    let configResult = configParser.search();
    if (!(_b = (_a = configResult) === null || _a === void 0 ? void 0 : _a.isEmpty, (_b !== null && _b !== void 0 ? _b : true))) {
        mergeObject(gConfig, configResult.config);
    }
    if ((_c = options) === null || _c === void 0 ? void 0 : _c.config) {
        configResult = configParser.load(options.config);
        if (!(_e = (_d = configResult) === null || _d === void 0 ? void 0 : _d.isEmpty, (_e !== null && _e !== void 0 ? _e : true))) {
            mergeObject(gConfig, configResult.config);
        }
    }
    if ((_f = options) === null || _f === void 0 ? void 0 : _f.themes) {
        if (typeof options.themes === 'string') {
            gConfig.themes = options.themes
                .split(',')
                .map((x) => x.trim());
        }
        else if (Array.isArray(options.themes)) {
            gConfig.themes = [...options.themes];
        }
    }
    gIgnoreErrors = (_h = (_g = options) === null || _g === void 0 ? void 0 : _g.ignoreErrors, (_h !== null && _h !== void 0 ? _h : false));
    const messages = [];
    if (typeof ((_j = options) === null || _j === void 0 ? void 0 : _j.console) === 'string') {
        if (((_k = options) === null || _k === void 0 ? void 0 : _k.console) === 'log') {
            terminal.useColor(false);
            gConfig.console = {
                log: (m) => {
                    messages.push(m);
                },
                error: (m) => {
                    messages.push(m);
                },
            };
        }
    }
    else {
        gConfig.console = (_m = (_l = options) === null || _l === void 0 ? void 0 : _l.console, (_m !== null && _m !== void 0 ? _m : {
            log: (m) => console.error(m),
            error: (m) => console.error(m),
        }));
    }
    if (!gConfig.themes)
        gConfig.themes = [];
    gConfig.tokenFileExt = (_r = (_p = (_o = options) === null || _o === void 0 ? void 0 : _o.tokenFileExt, (_p !== null && _p !== void 0 ? _p : (_q = gConfig) === null || _q === void 0 ? void 0 : _q.tokenFileExt)), (_r !== null && _r !== void 0 ? _r : 'yaml'));
    gConfig.verbose = (_v = (_t = (_s = options) === null || _s === void 0 ? void 0 : _s.verbose, (_t !== null && _t !== void 0 ? _t : (_u = gConfig) === null || _u === void 0 ? void 0 : _u.verbose)), (_v !== null && _v !== void 0 ? _v : false));
    gConfig.splitOutput = options.splitOutput;
    gConfig.outputFormat = (_z = (_x = (_w = options) === null || _w === void 0 ? void 0 : _w.format, (_x !== null && _x !== void 0 ? _x : (_y = gConfig) === null || _y === void 0 ? void 0 : _y.outputFormat)), (_z !== null && _z !== void 0 ? _z : ''));
    if (!gConfig.outputFormat) {
        const fileExt = ((_0 = options) === null || _0 === void 0 ? void 0 : _0.output) && path.extname((_1 = options) === null || _1 === void 0 ? void 0 : _1.output);
        if (fileExt) {
            const matchingExtensions = Object.keys(gConfig.formats).filter(x => gConfig.formats[x].ext === fileExt);
            if (matchingExtensions.length === 1) {
                gConfig.outputFormat = matchingExtensions[0];
            }
            else {
                if (gConfig.formats[fileExt.slice(1)]) {
                    gConfig.outputFormat = fileExt.slice(1);
                }
                else if (matchingExtensions.length > 1) {
                    error([
                        terminal.error('Ambiguous format. ') +
                            `Use ${terminal.keyword('--format')} to indicate which output format to use.`,
                        `Did you mean \`${matchingExtensions.join(', ')}\`?`,
                    ]);
                }
            }
        }
        if (gConfig.outputFormat) {
            if (gConfig.verbose) {
                log(terminal.warning() +
                    `Setting the format to "gConfig.outputFormat" based on the output file extension. ` +
                    'Use `--format` to indicate which output format to use.');
            }
        }
        else {
            gConfig.outputFormat = 'yaml';
            log(terminal.warning('Format not specified.') +
                ` Using "${terminal.keyword('yaml')}". ` +
                `Use ${terminal.keyword('--format')} to indicate which output format to use.`);
        }
    }
    mergeObject(gConfig.nameFormatters, (_2 = options) === null || _2 === void 0 ? void 0 : _2.nameFormatters);
    mergeObject(gConfig.valueFormatters, (_3 = options) === null || _3 === void 0 ? void 0 : _3.valueFormatters);
    const result = build(paths, options);
    if (messages.length > 0) {
        result['stderr'] = messages.join('\n');
    }
    return result;
}
mergeObject(gConfig, DefaultFormatters);
mergeObject(gConfig, WebFormats);
mergeObject(gConfig, GenericFormats);
mergeObject(gConfig, StyleGuideFormat);
module.exports = chromatic;

exports.chromatic = chromatic;
//# sourceMappingURL=chromatic.js.map
