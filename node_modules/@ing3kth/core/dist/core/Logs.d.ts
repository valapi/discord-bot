import { ILogs } from '../interface/ILogs';
declare type Logs_Mode = 'error' | 'warning' | 'system' | 'info' | 'unknown';
/**
 * Log data for debugging purposes.
 */
declare class Logs {
    classId: string;
    path: string;
    file: any;
    /**
     * @param {String} fileName File name.
     * @param {String} path Where to save the logs file.
     */
    constructor(fileName?: string, path?: string);
    /**
     * @param {String} dataWithFile Insert Data with log file.
     * @returns {Promise<any>}
     */
    new(dataWithFile?: string): Promise<any>;
    /**
     *
     * @param {any} data Any data to log.
     * @param {String} mode Log mode. (log, error, system)
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<any>}
     */
    log(data: any, mode?: Logs_Mode, showup?: boolean): Promise<any>;
    /**
     *
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<Array<ILogs>>}
     */
    get(showup?: boolean): Promise<Array<ILogs>>;
    static logMessage(data: any, mode?: Logs_Mode): string;
    /**
     *
     * @param {any} data Any data to log.
     * @param {String} mode Log mode.
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<void>}
     */
    static log(data: any, mode?: Logs_Mode, showup?: boolean): Promise<void>;
    /**
     *
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<any>}
     */
    static get(showup?: boolean): Promise<any>;
    /**
     * @param {Number} times Number of times to pre create the log.
     * @returns {Promise<void>}
     */
    static preCreate_WithDate(times?: number): Promise<void>;
}
export { Logs, type Logs_Mode };
//# sourceMappingURL=Logs.d.ts.map