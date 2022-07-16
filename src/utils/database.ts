import mongoose from "mongoose";
import * as process from 'process';

import { Logs } from "@ing3kth/core";

import * as dotenv from 'dotenv';

type ICollectionName = 'account' | 'daily'

interface IValorantAccount {
    account: string;
    discordId: number;
    createdAt: Date;
}

const _valorantSchema = new mongoose.Schema<IValorantAccount>({
    account: { type: String, required: true },
    discordId: { type: Number, required: true },
    createdAt: {
        type: Date,
        immutable: true,
        required: false,
        default: () => Date.now(),
        expires: 1296000000,
    },
});

interface IValorantSave {
    user: string;
    userId: string;
    guild: string;
    channelId: string;
}

const _saveSchema = new mongoose.Schema<IValorantSave>({
    user: { type: String, required: true },
    userId: { type: String, required: true },
    guild: { type: String, required: true },
    channelId: { type: String, required: true },
});

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

        //dot ENV
        dotenv.config({
            path: process.cwd() + '/.env'
        });
    }

    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<void>}
     */
    public async login(token: string = String(process.env['MONGO_TOKEN'])): Promise<void> {
        if (!token) {
            await Logs.log('token is not defined', 'error');
        }

        await mongoose.connect(token);
    }

    /**
     * Get {@link mongoose.Model} of the collection
     * @param {string} name name of the collection
     * @returns {mongoose.Model}
     */
    public getCollection<YourCollectionInterface>(name: ICollectionName, schema: mongoose.Schema): mongoose.Model<YourCollectionInterface, any, any, any> {
        try {
            return mongoose.model<YourCollectionInterface>(name, schema);
        } catch (error) {
            return mongoose.model<YourCollectionInterface>(name);
        }
    }

    //static

    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<ValData>}
     */
    public static async create(token?: string): Promise<ValData> {
        const _database = new ValData();
        await _database.login(token);

        return _database;
    }

    /**
     * Check if collection is exist or not
     * @param config checking config
     * @returns {Promise<{ isFind: Boolean, total: Number, data: Array<YourCollectionInterface>, model: mongoose.Model<YourCollectionInterface, any, any, any> }>}
     */
    public static async checkCollection<YourCollectionInterface>(config: {
        name: ICollectionName,
        schema: mongoose.Schema,
        filter?: mongoose.FilterQuery<YourCollectionInterface>,
        token?: string,
    }): Promise<{ isFind: Boolean, total: Number, data: Array<YourCollectionInterface>, model: mongoose.Model<YourCollectionInterface, any, any, any> }> {

        const _MyCollection = (await ValData.create(config.token)).getCollection<YourCollectionInterface>(config.name, config.schema);
        const _FindInDatabase: Array<YourCollectionInterface> = await _MyCollection.find(config.filter || {});

        return {
            ...{
                isFind: (Number(_FindInDatabase.length) > 0),
                total: Number(_FindInDatabase.length),
                data: _FindInDatabase,
                once: _FindInDatabase[0],
            },
            ...{
                model: _MyCollection
            }
        };
    }
}

export {
    //controller
    ValData,

    //valorant account
    type IValorantAccount,
    _valorantSchema as ValorantSchema,

    //valorant save
    type IValorantSave,
    _saveSchema as SaveSchema,
};