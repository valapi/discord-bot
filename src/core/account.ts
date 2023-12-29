import { AuthClient } from "valorant.ts";
import type { AuthCore } from "valorant.ts";

export default class Account {
    public userId: string;
    public client: AuthClient;

    public constructor(userId: string) {
        this.userId = userId;
        this.client = new AuthClient();
    }

    public set() {
        return database.put(this.userId, this.client.toJSON());
    }

    public get() {
        return database.get(this.userId);
    }

    public async load(saved: AuthCore.Json = this.get() || this.client.toJSON()) {
        this.client.fromJSON(saved);

        if (Date.now() >= this.client.getExpirationDate()) {
            await this.client.refresh();

            await this.set();
        }
    }

    public async fetch() {
        const saved = this.get();

        if (saved) {
            await this.load(saved);

            return this.client.toJSON();
        } else {
            return saved;
        }
    }

    public remove() {
        return database.remove(this.userId, this.client.toJSON());
    }

    public static fetch(userId: string) {
        const account = new Account(userId);

        return account.fetch();
    }
}
