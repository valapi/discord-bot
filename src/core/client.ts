import { Client as DiscordClient, Collection } from "discord.js";
import type { ClientOptions } from "discord.js";

import Command from "./command";

import config from "../data/config.json";

export default class Client extends DiscordClient {
    public command: Collection<string, Command> = new Collection();

    public userRateLimit: Record<string, number> = {};

    public constructor(option: ClientOptions) {
        super(option);
    }

    public rateLimit(id: string): boolean {
        if (this.userRateLimit[id]) {
            this.userRateLimit[id] = this.userRateLimit[id] + 1;

            return this.userRateLimit[id] > config.rateLimit;
        } else {
            this.userRateLimit[id] = 1;

            return false;
        }
    }
}
