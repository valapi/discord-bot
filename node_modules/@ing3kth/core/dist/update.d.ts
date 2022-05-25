import { Axios } from 'axios';
import { IUpdate } from './interface/IUpdate';
declare class Update {
    classId: string;
    axiosClient: Axios;
    constructor();
    /**
     *
     * @returns {Promise<any>}
     */
    getVersion(): Promise<any>;
    /**
     *
     * @returns {Promise<IUpdate>}
     */
    checkForUpdate(): Promise<IUpdate>;
    /**
     *
     * @returns {Promise<any>}
     */
    static getVersion(): Promise<any>;
    /**
     *
     * @returns {Promise<IUpdate>}
     */
    static checkForUpdate(): Promise<IUpdate>;
}
export { Update };
//# sourceMappingURL=update.d.ts.map