import { ICurrency } from "./ICurrency";
export declare class IStoreOffers {
    Offers: IStoreOffer[];
    UpgradeCurrencyOffers: IStoreCurrencyOffer[];
    constructor(data: any);
}
export declare class IStoreOffer {
    OfferID: string;
    IsDirectPurchase: boolean;
    StartDate: string;
    Cost: ICurrency;
    Rewards: IStoreOfferReward[];
    constructor(data: any);
}
export interface IStoreOfferReward {
    ItemTypeID: string;
    ItemID: string;
    Quantity: number;
}
export interface IStoreCurrencyOffer {
    OfferID: string;
    StorefrontItemID: string;
}
