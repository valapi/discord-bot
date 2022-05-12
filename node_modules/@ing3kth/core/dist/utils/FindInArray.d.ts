import { IFindInArray } from "../interface/IFindInArray";
/**
 *
 * @param {Array<any>} array Array
 * @param {any} target Target To Find In Array
 * @returns {IFindInArray}
 */
declare function normal(array: Array<any>, target: any): IFindInArray;
/**
 * @param {Array<any>} array Array
 * @param {any} target Target To Find In Array
 * @param {Number} start Start Path in Array to find Target
 * @param {Number} end End Path in Array to find Target
 * @returns {IFindInArray}
 */
declare function find(array: Array<any>, target: any, start?: number, end?: number): IFindInArray;
/**
 * @param {Array<any>} array Array
 * @param {any} target Target To Find In Array
 * @returns {IFindInArray}
 */
declare function start(array: Array<any>, target: any): IFindInArray;
export { normal, find, start, };
//# sourceMappingURL=FindInArray.d.ts.map