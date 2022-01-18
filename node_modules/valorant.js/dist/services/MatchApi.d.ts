import { RiotApiClient } from "../index";
export declare class MatchApi {
    private _client;
    constructor(client: RiotApiClient);
    /**
     * - Gets a match by id
     * @param matchId Match to get
     */
    getMatchById(matchId: string): Promise<any>;
    /**
     * - Gets match history
     * @param accountId Account to get the history of
     * @param startIndex Index to start with
     * @param endIndex Index to end with
     */
    getMatchHistory(accountId: string, startIndex?: number, endIndex?: number): Promise<any>;
    /**
     * - Gets mmr of a player
     * @param playerId Player to get mmr of
     */
    getMmr(playerId: string): Promise<any>;
    /**
     * - Gets ranked history
     * @param accountId Account to get the history of
     * @param startIndex Index to start with
     * @param endIndex Index to end with
     */
    getCompetitiveHistory(accountId: string, startIndex?: number, endIndex?: number): Promise<any>;
    /**
     * - Gets competitive leaderboard
     * @param seasonId Season to get the leaderboard of
     */
    getCompetitiveLeaderboard(seasonId: number): Promise<any>;
}
