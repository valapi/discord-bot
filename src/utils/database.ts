//import

import mongoose from "mongoose";
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

    public async login(token: string = String(process.env['MONGO_TOKEN'])): Promise<void> {
        if (!token) {
            Logs.log('token is not defined', 'error');
        }

        await mongoose.connect(token);
    }

    public getModel<YourCollectionInterface>(name: ICollectionName, schema: mongoose.Schema): mongoose.Model<YourCollectionInterface, any, any, any> {
        try {
            return mongoose.model<YourCollectionInterface>(name, schema);
        } catch (error) {
            return mongoose.model<YourCollectionInterface>(name);
        }
    }

    //static

    public static async checkCollection<YourCollectionInterface>(config: {
        name: ICollectionName,
        schema: mongoose.Schema,
        filter?: mongoose.FilterQuery<YourCollectionInterface>,
        token?: string,
    }): Promise<{ isFind: Boolean, data: Array<YourCollectionInterface>, model: mongoose.Model<YourCollectionInterface, any, any, any> }> {

        const MyDatabase = new ValorDatabase();
        await MyDatabase.login(config.token);

        const _MyCollection = MyDatabase.getModel<YourCollectionInterface>(config.name, config.schema);
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