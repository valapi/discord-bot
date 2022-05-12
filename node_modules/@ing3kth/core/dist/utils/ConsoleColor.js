"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colored = exports.newline = exports.background = exports.effect = exports.color = void 0;
const _Color = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};
exports.color = _Color;
const _Effect = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
};
exports.effect = _Effect;
const _Background = {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
};
exports.background = _Background;
const _NewLine = '\n';
exports.newline = _NewLine;
/**
*
* @param {String} text Text
* @param {String} color Color
* @returns {String}
*/
function colored(text, color) {
    return `${_Color[color]}${text}${_Effect.reset}`;
}
exports.colored = colored;
//# sourceMappingURL=ConsoleColor.js.map