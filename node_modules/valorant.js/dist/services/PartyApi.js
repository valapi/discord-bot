"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyApi = void 0;
const Request_1 = require("../Request");
class PartyApi {
    constructor(client) {
        this._client = client;
    }
    /**
     * - Gets a party by id
     * @param partyId Party to get
     */
    async getPartyById(partyId) {
        const partyReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.PartyUrl + `/parties/v1/parties/${partyId}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(partyReq)).data;
    }
    /**
     * - Gets a party by player id
     * @param playerId Player to get the party from
     */
    async getPartyByPlayer(playerId) {
        const partyReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.PartyUrl + `/parties/v1/players/${playerId}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(partyReq)).data;
    }
}
exports.PartyApi = PartyApi;
//# sourceMappingURL=PartyApi.js.map