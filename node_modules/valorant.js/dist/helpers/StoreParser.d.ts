import { IStorefront } from "../models/IStorefront";
import { IStorefrontParsed } from "../models/IStorefrontParsed";
import { IStoreOffer } from "../models/IStoreOffers";
export declare class StoreParser {
    data: IStorefront;
    contentList: any[];
    offerList: IStoreOffer[];
    constructor(data: IStorefront, contentList: any, offerList: IStoreOffer[]);
    parse(): IStorefrontParsed;
    private getItem;
}
