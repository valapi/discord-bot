import { RiotApiClient } from "../index";
export declare class PartyApi {
    private _client;
    constructor(client: RiotApiClient);
    /**
     * - Gets a party by id
     * @param partyId Party to get
     */
    getPartyById(partyId: string): Promise<any>;
    /**
     * - Gets a party by player id
     * @param playerId Player to get the party from
     */
    getPartyByPlayer(playerId: string): Promise<any>;
}
