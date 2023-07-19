import { AuthClient } from "valorant.ts";
import type { AuthCore } from "valorant.ts";

export default class Account {
    public userId: string;
    public client: AuthClient;

    public constructor(userId: string) {
        this.userId = userId;
        this.client = new AuthClient()
    }

    public setTmp() {
        return database.put(this.userId, this.client.toJSON());
    }

    public getTmp() {
        return database.get(this.userId);
    }

    public async loadTmp(saved: AuthCore.Json = this.getTmp() || this.client.toJSON()) {
        this.client.fromJSON(saved);

        if (Date.now() >= this.client.getExpirationDate()) {
            await this.client.refresh();

            await this.setTmp();
        }
    }

    public async fetchTmp() {
        const saved = this.getTmp();

        if (saved) {
            await this.loadTmp(saved);

            return this.client.toJSON();
        } else {
            return saved;
        }
    }

    public removeTmp() {
        return database.remove(this.userId, this.client.toJSON());
    }

    public static fetchTmp(userId: string) {
        const account = new Account(userId);

        return account.fetchTmp();
    }
}