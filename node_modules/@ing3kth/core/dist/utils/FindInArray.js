"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.find = exports.normal = void 0;
/**
 *
 * @param {Array<any>} array Array
 * @param {any} target Target To Find In Array
 * @returns {IFindInArray}
 */
function normal(array, target) {
    for (let i in array) {
        if (array[Number(i)] === target) {
            return {
                find: true,
                position: Number(i),
            };
        }
    }
    return {
        find: false,
        position: NaN,
    };
}
exports.normal = normal;
/**
 * @param {Array<any>} array Array
 * @param {any} target Target To Find In Array
 * @param {Number} start Start Path in Array to find Target
 * @param {Number} end End Path in Array to find Target
 * @returns {IFindInArray}
 */
function find(array, target, start = 0, end = array.length) {
    if (start > end) {
        return normal(array, target);
    }
    const middle = Math.floor((start + end) / 2);
    if (array[middle] === target) {
        return {
            find: true,
            position: middle,
        };
    }
    if (array[middle] > target) {
        return find(array, target, start, middle - 1);
    }
    if (array[middle] < target) {
        return find(array, target, middle + 1, end);
    }
    return {
        find: false,
        position: NaN,
    };
}
exports.find = find;
/**
 * @param {Array<any>} array Array
 * @param {any} target Target To Find In Array
 * @returns {IFindInArray}
 */
function start(array, target) {
    if (array[0] === target) {
        return {
            find: true,
            position: 0,
        };
    }
    if (array[array.length] === target) {
        return {
            find: true,
            position: array.length,
        };
    }
    const _Find = find(array, target, Number(0), Number(array.length));
    if (!_Find) {
        return normal(array, target);
    }
    return _Find;
}
exports.start = start;
//# sourceMappingURL=FindInArray.js.map