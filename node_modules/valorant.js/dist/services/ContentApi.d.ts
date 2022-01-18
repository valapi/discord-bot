import { RiotApiClient } from "../index";
import { IItemUpgrades } from "../models/IItemUpgrades";
export declare class ContentApi {
    private _client;
    constructor(client: RiotApiClient);
    /**
     * - Gets the current story contract definitions
     */
    getStoryContract(): Promise<any>;
    /**
     * - Gets a player's contract
     */
    getContractByPlayer(playerId: string): Promise<any>;
    /**
     * - Gets item upgrades
     */
    getItemUpgrades(): Promise<IItemUpgrades>;
    /**
     * - Gets all items
     */
    getContent(): Promise<any>;
}
