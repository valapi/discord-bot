import mongoose from "mongoose";
import * as process from 'process';

import { Logs } from "@ing3kth/core";

import * as dotenv from 'dotenv';

interface IValorantAccount {
    account: string;
    discordId: number;
    update: Date;
}

const _valorantSchema = new mongoose.Schema<IValorantAccount>({
    account: { type: String, required: true },
    discordId: { type: Number, required: true },
    update: { type: Date, required: false },
})

class ValData {
    constructor() {
        //event
        mongoose.connection.on("error", (async (error) => {
            await Logs.log(error, 'error');
        }));

        mongoose.connection.on("connected", (async () => {
            await Logs.log('Successfully connected to database', 'system');
        }));

        mongoose.connection.on("disconnected", (async () => {
            await Logs.log('Disconnected from database', 'warning');
        }));
    }

    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<void>}
     */
    public async login(token:string = String(process.env['MONGO_TOKEN'])): Promise<void> {
        if(!token){
            await Logs.log('token is not defined', 'error');
        }

        await mongoose.connect(token);
    }

    /**
     * Get {@link mongoose.Model} of the collection
     * @param {string} name name of the collection
     * @returns {mongoose.Model}
     */
    public getCollection<YourCollectionInterface = IValorantAccount>(name:string = 'account', schema:mongoose.Schema = _valorantSchema, collection:string = 'valorant'): mongoose.Model<YourCollectionInterface, any, any, any> {
        try {
            return mongoose.model<YourCollectionInterface>(name, schema, collection);
        } catch (error) {
            return mongoose.model<YourCollectionInterface>(name);
        }
    }

    /**
     * Check if collection is exist or not
     * @param {mongoose.Model} model Model of the collection
     * @param {mongoose.FilterQuery} filter filter to check
     * @returns {Promise<number>}
     */
     public static async checkIfExist<YourCollectionInterface = IValorantAccount>(model:mongoose.Model<YourCollectionInterface, any, any, any>, filter:mongoose.FilterQuery<YourCollectionInterface>): Promise<number> {
        const _FindInDatabase = await model.find(filter);

        return Number(_FindInDatabase.length);
    }

    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<ValData>}
     */
     public static async verify(token?:string): Promise<ValData> {
        const _database = new ValData();
        _database.login(token);

        return _database;
    }
}

export { 
    ValData,
    type IValorantAccount,
};