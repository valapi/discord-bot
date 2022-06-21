import mongoose from "mongoose";
declare type ICollectionName = 'account' | 'daily';
interface IValorantAccount {
    account: string;
    discordId: number;
    createdAt: Date;
}
declare const _valorantSchema: mongoose.Schema<IValorantAccount, mongoose.Model<IValorantAccount, any, any, any, any>, {}, {}, any, {}, "type", IValorantAccount>;
interface IValorantSave {
    user: string;
    userId: string;
    guild: string;
    channelId: string;
}
declare const _saveSchema: mongoose.Schema<IValorantSave, mongoose.Model<IValorantSave, any, any, any, any>, {}, {}, any, {}, "type", IValorantSave>;
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
    getCollection<YourCollectionInterface>(name: ICollectionName, schema: mongoose.Schema): mongoose.Model<YourCollectionInterface, any, any, any>;
    /**
     * Check if collection is exist or not
     * @param {mongoose.Model} model Model of the collection
     * @param {mongoose.FilterQuery} filter filter to check
     * @returns {Promise<number>}
     */
    static checkIfExist<YourCollectionInterface>(model: mongoose.Model<YourCollectionInterface, any, any, any>, filter?: mongoose.FilterQuery<YourCollectionInterface>): Promise<{
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
export { ValData, type IValorantAccount, _valorantSchema as ValorantSchema, type IValorantSave, _saveSchema as SaveSchema, };
//# sourceMappingURL=database.d.ts.map