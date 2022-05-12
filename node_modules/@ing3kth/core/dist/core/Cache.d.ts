import { ICache } from '../interface/ICache';
/**
 * Cache Data in JSON format.
 */
declare class Cache {
    classId: string;
    baseName: string;
    path: string;
    file: any;
    /**
     *
     * @param {String} name Name
     */
    constructor(name?: string);
    /**
     * @param {Object} dataWithFile Insert Data with log file.
     * @returns {Promise<any>}
     */
    create(dataWithFile?: object): Promise<any>;
    /**
     *
     * @param {any} data Data to save.
     * @param {String} interactionId Interaction ID.
     * @returns {Promise<ICache>}
     */
    input(data: any, interactionId?: string): Promise<ICache>;
    /**
     * @param {String} interactionId Interaction ID.
     * @returns {Promise<any>}
     */
    output(interactionId: string): Promise<any>;
    /**
     * @param {String} interactionId Interaction ID.
     * @returns {Promise<void>}
     */
    clear(interactionId: string): Promise<void>;
    /**
     * @param {ICache} path Path to Data.
     * @returns {Promise<any>}
     */
    static output(path: ICache): Promise<any>;
}
export { Cache };
//# sourceMappingURL=Cache.d.ts.map