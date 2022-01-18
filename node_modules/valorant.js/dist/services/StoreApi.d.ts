import { ICurrency } from "../models/ICurrency";
import { RiotApiClient } from "../index";
import { IStorefront } from "../models/IStorefront";
import { IStorefrontParsed } from "../models/IStorefrontParsed";
import { IStoreOffers } from "../models/IStoreOffers";
export declare class StoreApi {
    private _client;
    constructor(client: RiotApiClient);
    /**
     * - Gets the users wallet (valorant points etc.)
     * @param accountId Account to get the wallet for
     */
    getWallet(accountId: string): Promise<ICurrency[]>;
    /**
     * - Gets the storefront
     * @param accountId Account to get storefront for
     * @param parse Wether to parse the shop or not
     */
    getStorefront(accountId: string, parse: boolean): Promise<IStorefront | IStorefrontParsed>;
    /**
     * - Gets the store offers
     */
    getStoreOffers(): Promise<IStoreOffers>;
}
