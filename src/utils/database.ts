// import

import mongoose from "mongoose";
import * as process from "process";

import { Region } from "@valapi/lib";

namespace ValorInterface {
    export type CollectionName = "account" | "daily";

    export namespace Account {
        export interface Format {
            account: string;
            region: Region.Identify;
            discordId: number;
            createdAt: Date;
        }

        export const Schema = new mongoose.Schema<ValorInterface.Account.Format>({
            account: {
                type: String,
                required: true
            },
            region: {
                type: String,
                required: true
            },
            discordId: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                immutable: true,
                required: false,
                default: () => Date.now(),
                expires: 1296000000
            }
        });
    }

    export namespace Daily {
        export interface Format {
            user: string;
            userId: string;
            guild: string;
            channelId: string;
        }

        export const Schema = new mongoose.Schema<ValorInterface.Daily.Format>({
            user: {
                type: String,
                required: true
            },
            userId: {
                type: String,
                required: true
            },
            guild: {
                type: String,
                required: true
            },
            channelId: {
                type: String,
                required: true
            }
        });
    }
}

// function

async function ValorDatabase<CollectionInterface>(config: {
    name: ValorInterface.CollectionName;
    schema: mongoose.Schema;
    filter?: mongoose.FilterQuery<CollectionInterface>;
    token?: string;
}): Promise<{
    isFind: boolean;
    data: Array<CollectionInterface>;
    model: mongoose.Model<CollectionInterface, any, any, any>;
}> {
    // login

    if (!config.token) {
        if (process.env["MONGO_TOKEN"]) {
            config.token = process.env["MONGO_TOKEN"];
        } else {
            throw new Error("token is undefined");
        }
    }

    await mongoose.connect(config.token);

    // model

    let MyModel: mongoose.Model<CollectionInterface, any, any, any>;

    try {
        MyModel = mongoose.model<CollectionInterface>(config.name, config.schema);
    } catch (error) {
        MyModel = mongoose.model<CollectionInterface>(config.name);
    }

    // find

    const MyData: Array<CollectionInterface> = await MyModel.find(config.filter || {});

    return {
        isFind: MyData.length > 0,
        data: MyData,
        model: MyModel
    };
}

// export

export { ValorDatabase, ValorInterface };
