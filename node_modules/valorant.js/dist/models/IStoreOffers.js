"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStoreOffer = exports.IStoreOffers = void 0;
const Currency_1 = __importDefault(require("../resources/Currency"));
class IStoreOffers {
    constructor(data) {
        this.Offers = data.Offers.map(o => new IStoreOffer(o));
        this.UpgradeCurrencyOffers = data.UpgradeCurrencyOffers;
    }
}
exports.IStoreOffers = IStoreOffers;
class IStoreOffer {
    constructor(data) {
        this.OfferID = data.OfferID;
        this.IsDirectPurchase = data.IsDirectPurchase;
        this.StartDate = data.StartDate;
        const _ = Object.keys(data.Cost)[0];
        this.Cost = { id: _, amount: data.Cost[_], name: Currency_1.default[_] };
        this.Rewards = data.Rewards;
    }
}
exports.IStoreOffer = IStoreOffer;
//# sourceMappingURL=IStoreOffers.js.map