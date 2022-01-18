"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchApi = void 0;
const Request_1 = require("../Request");
class MatchApi {
    constructor(client) {
        this._client = client;
    }
    /**
     * - Gets a match by id
     * @param matchId Match to get
     */
    async getMatchById(matchId) {
        const matchReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + `/match-details/v1/matches/${matchId}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(matchReq)).data;
    }
    /**
     * - Gets match history
     * @param accountId Account to get the history of
     * @param startIndex Index to start with
     * @param endIndex Index to end with
     */
    async getMatchHistory(accountId, startIndex = 0, endIndex = 10) {
        const matchReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + "/match-history/v1/history/" + accountId + `?startIndex${startIndex}&endIndex=${endIndex}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(matchReq)).data;
    }
    /**
     * - Gets mmr of a player
     * @param playerId Player to get mmr of
     */
    async getMmr(playerId) {
        const mmrReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + `/mmr/v1/players/${playerId}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(mmrReq)).data;
    }
    /**
     * - Gets ranked history
     * @param accountId Account to get the history of
     * @param startIndex Index to start with
     * @param endIndex Index to end with
     */
    async getCompetitiveHistory(accountId, startIndex = 0, endIndex = 10) {
        const matchReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + "/mmr/v1/players/" + accountId + `/competitiveupdates?startIndex${startIndex}&endIndex=${endIndex}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(matchReq)).data;
    }
    /**
     * - Gets competitive leaderboard
     * @param seasonId Season to get the leaderboard of
     */
    async getCompetitiveLeaderboard(seasonId) {
        const compReq = new Request_1.RequestBuilder()
            .setUrl(this._client.region.BaseUrl + `/mmr/v1/leaderboards/affinity/${this._client.region.Name}/queue/competitive/season/${seasonId}`)
            .setMethod("GET")
            .build();
        return (await this._client.http.sendRequest(compReq)).data;
    }
}
exports.MatchApi = MatchApi;
//# sourceMappingURL=MatchApi.js.map