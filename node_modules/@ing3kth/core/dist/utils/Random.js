"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
/**
 *
 * @param {Number} min Minimum value.
 * @param {Number} max Maximum value.
 * @returns {Number}
 */
function Random(min = 0, max) {
    if (min === max) {
        return min;
    }
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }
    const randomMin = Math.ceil(min);
    const randomMax = Math.floor(max);
    const _random = Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin;
    return _random;
}
exports.Random = Random;
//# sourceMappingURL=Random.js.map