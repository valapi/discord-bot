"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ing3kth/core");
const dotenv = __importStar(require("dotenv"));
const process = __importStar(require("process"));
const discord_js_1 = require("discord.js");
const crypto_1 = require("../utils/crypto");
const Milliseconds_1 = require("@ing3kth/core/dist/utils/Milliseconds");
//valorant
const database_1 = require("../utils/database");
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
function dailyStoreTrigger(DiscordClient) {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv.config({
            path: process.cwd() + '/.env'
        });
        /**
         * Get Account
         */
        //token
        const ValToken = (yield database_1.ValData.verify()).getCollection('daily', database_1.SaveSchema);
        const ValTokenInDatabase = yield database_1.ValData.checkIfExist(ValToken);
        if (ValTokenInDatabase.isFind === false) {
            return;
        }
        for (let _token of ValTokenInDatabase.data) {
            try {
                //account
                const ValDatabase = (yield database_1.ValData.verify()).getCollection('account', database_1.ValorantSchema);
                const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: _token.userId });
                //valorant
                const ValApiCom = new valorant_api_com_1.Client();
                const ValClient = new api_wrapper_1.Client({
                    region: "ap",
                });
                ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                    yield ValToken.deleteMany({ userId: _token.userId });
                })));
                //settings
                if (!ValAccountInDatabase.isFind) {
                    yield ValDatabase.deleteMany({ discordId: _token.userId });
                    continue;
                }
                const SaveAccount = ValAccountInDatabase.once.account;
                const apiKey = (0, crypto_1.genarateApiKey)(_token.user, _token.guild, process.env['PUBLIC_KEY']);
                ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
                yield ValClient.reconnect(true);
                /**
                 * Get Offers
                 */
                const getCurency = yield ValApiCom.Currencies.get();
                const getOffers = yield ValClient.Store.GetOffers();
                const GetWeaponSkin = yield ValApiCom.Weapons.getSkins();
                function getOffersOf(ItemsId) {
                    var _a, _b, _c;
                    return __awaiter(this, void 0, void 0, function* () {
                        let Store_ItemID = '';
                        let Store_Quantity = '';
                        let Store_ID = '';
                        let Store_Cost = '';
                        let Store_Curency_Name = 'VP';
                        let Store_Curency_ID = '';
                        let Store_StartTime = '';
                        // Main // 
                        for (const TheOffer of getOffers.data.Offers) {
                            for (const _offer of TheOffer.Rewards) {
                                Store_ItemID = _offer.ItemID;
                                Store_Quantity = _offer.Quantity;
                                if (Store_ItemID === ItemsId) {
                                    Store_ID = TheOffer.OfferID;
                                    Store_StartTime = TheOffer.StartDate;
                                    if (!getCurency.isError && getCurency.data.data) {
                                        for (const _currency of getCurency.data.data) {
                                            Store_Cost = TheOffer.Cost[_currency.uuid];
                                            Store_Curency_Name = _currency.displayName;
                                            Store_Curency_ID = _currency.uuid;
                                            if (Store_Cost) {
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                            if (Store_ID && Store_Cost) {
                                break;
                            }
                        }
                        // Content Tier Id //
                        let Store_ContentTier_ID = '';
                        if (!GetWeaponSkin.isError && GetWeaponSkin.data.data) {
                            for (const _Skins of GetWeaponSkin.data.data) {
                                for (const _Level of _Skins.levels) {
                                    if (_Level.uuid === ItemsId) {
                                        Store_ContentTier_ID = _Skins.contentTierUuid;
                                        break;
                                    }
                                }
                                if (Store_ContentTier_ID) {
                                    break;
                                }
                            }
                        }
                        // Content Tier //
                        let Store_ContentTier_Name = '';
                        let Store_ContentTier_Display = '';
                        const GetContentTier = yield ValApiCom.ContentTiers.getByUuid(String(Store_ContentTier_ID));
                        Store_ContentTier_Name = String((_a = GetContentTier.data.data) === null || _a === void 0 ? void 0 : _a.devName);
                        Store_ContentTier_Display = String((_b = GetContentTier.data.data) === null || _b === void 0 ? void 0 : _b.displayIcon);
                        //color
                        let ContentTiersColor = String((_c = GetContentTier.data.data) === null || _c === void 0 ? void 0 : _c.highlightColor);
                        const _Color = ContentTiersColor.substring(0, ContentTiersColor.length - 2);
                        //display
                        let Store_Display_Name = '';
                        let Store_Display_Icon = '';
                        const GetWeaponSkinLevel = yield ValApiCom.Weapons.getSkinLevels();
                        if (!GetWeaponSkinLevel.isError && GetWeaponSkinLevel.data.data) {
                            for (const _SkinLevel of GetWeaponSkinLevel.data.data) {
                                if (_SkinLevel.uuid === Store_ItemID) {
                                    Store_Display_Name = _SkinLevel.displayName;
                                    Store_Display_Icon = _SkinLevel.displayIcon;
                                    break;
                                }
                            }
                        }
                        return {
                            ItemId: Store_ItemID,
                            Quantity: Store_Quantity,
                            Id: Store_ID,
                            Cost: Store_Cost,
                            Curency: {
                                Name: Store_Curency_Name,
                                Id: Store_Curency_ID,
                            },
                            CreateTime: new Date(Store_StartTime || NaN),
                            ContentTier: {
                                Id: Store_ContentTier_ID,
                                Name: Store_ContentTier_Name,
                                Display: Store_ContentTier_Display,
                                Color: _Color,
                            },
                            Display: {
                                Name: Store_Display_Name,
                                Icon: Store_Display_Icon,
                            },
                        };
                    });
                }
                /**
                 * Get Daily Store
                 */
                const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
                const puuid = ValorantUserInfo.data.sub;
                const ValorantStore = yield ValClient.Store.GetStorefront(puuid);
                //store
                const TimeLeft = Number(ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds);
                const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers;
                const _time = (0, Milliseconds_1.ToMilliseconds)(TimeLeft * 1000);
                let sendMessageArray = [];
                for (const ofItemID in AllOffers) {
                    const ItemID = AllOffers[ofItemID];
                    const _Offer = yield getOffersOf(ItemID);
                    let sendMessage = ``;
                    sendMessage += `Price: **${_Offer.Cost} ${_Offer.Curency.Name}**\n`;
                    sendMessage += `Create At: **${_Offer.CreateTime.toUTCString()}**\n`;
                    sendMessage += `Slot: **${Number(ofItemID) + 1}**\n`;
                    const createEmbed = new discord_js_1.MessageEmbed()
                        .setColor(`#${_Offer.ContentTier.Color}`)
                        .setTitle(_Offer.Display.Name)
                        .setDescription(sendMessage)
                        .setThumbnail(_Offer.Display.Icon)
                        .setAuthor({ name: _Offer.ContentTier.Name, iconURL: _Offer.ContentTier.Display });
                    sendMessageArray.push(createEmbed);
                }
                /**
                 * Sent Message
                 */
                const _channel = DiscordClient.channels.cache.get('974289020911771718');
                if ((_channel === null || _channel === void 0 ? void 0 : _channel.isText()) || (_channel === null || _channel === void 0 ? void 0 : _channel.isThread())) {
                    yield _channel.send({
                        content: `This is the store of ${discord_js_1.Formatters.userMention(_token.userId)} today in Valorant\n\nTime Left: **${_time.all.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`,
                        embeds: sendMessageArray,
                    });
                }
                else {
                    yield ValToken.deleteMany({ userId: _token.userId });
                }
                core_1.Logs.log(`<${_token.userId}> sented today store in Valorant`, 'info');
            }
            catch (error) {
                continue;
            }
        }
    });
}
exports.default = dailyStoreTrigger;
;
//# sourceMappingURL=dailystore.js.map