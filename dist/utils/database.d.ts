import mongoose from "mongoose";
interface IValorantAccount {
    account: string;
    discordId: number;
    update: Date;
}
declare class ValData {
    constructor();
    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<void>}
     */
    login(token?: string): Promise<void>;
    /**
     * Get {@link mongoose.Model} of the collection
     * @param {string} name name of the collection
     * @returns {mongoose.Model}
     */
    getCollection<YourCollectionInterface = IValorantAccount>(name?: string, schema?: mongoose.Schema, collection?: string): mongoose.Model<YourCollectionInterface, any, any, any>;
    /**
     * Check if collection is exist or not
     * @param {mongoose.Model} model Model of the collection
     * @param {mongoose.FilterQuery} filter filter to check
     * @returns {Promise<number>}
     */
    static checkIfExist<YourCollectionInterface = IValorantAccount>(model: mongoose.Model<YourCollectionInterface, any, any, any>, filter: mongoose.FilterQuery<YourCollectionInterface>): Promise<{
        isFind: Boolean;
        total: Number;
        data: Array<YourCollectionInterface>;
        once: YourCollectionInterface;
    }>;
    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<ValData>}
     */
    static verify(token?: string): Promise<ValData>;
}
export { ValData, type IValorantAccount, };
//# sourceMappingURL=database.d.ts.map