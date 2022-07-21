//import

import * as mongoose from "mongoose";
import * as process from 'process';

import { Logs } from "@ing3kth/core";

type ICollectionName = 'account' | 'daily';

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

//script

class ValorDatabase {
    public constructor() {
        //event
        mongoose.connection.on("error", (async (error) => {
            Logs.log(error, 'error');
        }));

        mongoose.connection.on("connected", (async () => {
            Logs.log('Successfully connected to database', 'system');
        }));

        mongoose.connection.on("disconnected", (async () => {
            Logs.log('Disconnected from database', 'warning');
        }));
    }

    /**
     * login to mongodb database
     * @param {string} token token of access to database
     * @returns {Promise<void>}
     */
    public async login(token: string = String(process.env['MONGO_TOKEN'])): Promise<void> {
        if (!token) {
            Logs.log('token is not defined', 'error');
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
     * @returns {Promise<ValorDatabase>}
     */
    public static async create(token?: string): Promise<ValorDatabase> {
        const _database = new ValorDatabase();
        await _database.login(token);

        return _database;
    }

    /**
     * Check if collection is exist or not
     * @param config checking config
     * @returns {Promise<{ isFind: Boolean, data: Array<YourCollectionInterface>, model: mongoose.Model<YourCollectionInterface, any, any, any> }>}
     */
    public static async checkCollection<YourCollectionInterface>(config: {
        name: ICollectionName,
        schema: mongoose.Schema,
        filter?: mongoose.FilterQuery<YourCollectionInterface>,
        token?: string,
    }): Promise<{ isFind: Boolean, data: Array<YourCollectionInterface>, model: mongoose.Model<YourCollectionInterface, any, any, any> }> {

        const _MyCollection = (await ValorDatabase.create(config.token)).getCollection<YourCollectionInterface>(config.name, config.schema);
        const _FindInDatabase: Array<YourCollectionInterface> = await _MyCollection.find(config.filter || {});

        return {
            isFind: (_FindInDatabase.length > 0),
            data: _FindInDatabase,
            model: _MyCollection,
        };
    }
}

//export

export {
    //controller
    ValorDatabase,

    //valorant account
    type IValorantAccount,
    _valorantSchema as ValorantSchema,

    //valorant save
    type IValorantSave,
    _saveSchema as SaveSchema,
};