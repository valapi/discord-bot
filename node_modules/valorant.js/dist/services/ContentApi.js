"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentApi = void 0;
const Request_1 = require("../Request");
const ItemParser_1 = require("../helpers/ItemParser");
class ContentApi {
    constructor(client) {
        this._client = client;
    }
    /**
     * - Gets the current story contract definitions
     */
    async getStoryContract() {
        const storyReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + "/contract-definitions/v2/definitions/story")
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(storyReq)).data;
    }
    /**
     * - Gets a player's contract
     */
    async getContractByPlayer(playerId) {
        const storyReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + `/contracts/v1/contracts/${playerId}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(storyReq)).data;
    }
    /**
     * - Gets item upgrades
     */
    async getItemUpgrades() {
        const upgradeReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + "/contract-definitions/v3/item-upgrades")
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(upgradeReq)).data;
    }
    /**
     * - Gets all items
     */
    async getContent() {
        const contentReq = new Request_1.RequestBuilder()
            .setMethod("GET")
            .setUrl(this._client.region.SharedUrl + "/content-service/v2/content")
            .build();
        const contentRes = (await this._client.http.sendRequest(contentReq)).data;
        const parser = new ItemParser_1.ItemParser(contentRes);
        return parser.parse();
    }
}
exports.ContentApi = ContentApi;
//# sourceMappingURL=ContentApi.js.map