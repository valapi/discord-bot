declare const _Color: {
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
};
declare const _Effect: {
    reset: string;
    bright: string;
    dim: string;
    underscore: string;
    blink: string;
    reverse: string;
    hidden: string;
};
declare const _Background: {
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
};
declare const _NewLine = "\n";
/**
*
* @param {String} text Text
* @param {String} color Color
* @returns {String}
*/
declare function colored(text: string, color: keyof typeof _Color): string;
export { _Color as color, _Effect as effect, _Background as background, _NewLine as newline, colored, };
//# sourceMappingURL=ConsoleColor.d.ts.map