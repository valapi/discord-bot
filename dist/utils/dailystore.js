"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@ing3kth/core");
const dotenv = tslib_1.__importStar(require("dotenv"));
const process = tslib_1.__importStar(require("process"));
const discord_js_1 = require("discord.js");
const crypto_1 = require("../utils/crypto");
const Milliseconds_1 = require("@ing3kth/core/dist/utils/Milliseconds");
//valorant
const database_1 = require("../utils/database");
const web_client_1 = require("@valapi/web-client");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
function dailyStoreTrigger(DiscordClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        dotenv.config({
            path: process.cwd() + '/.env'
        });
        /**
         * Get Account
         */
        //token
        const ValDatabaseDaily = yield database_1.ValData.checkCollection({
            name: 'daily',
            schema: database_1.SaveSchema,
        });
        for (let _token of ValDatabaseDaily.data) {
            try {
                //account
                const ValDatabase = yield database_1.ValData.checkCollection({
                    name: 'account',
                    schema: database_1.ValorantSchema,
                    filter: { discordId: _token.userId }
                });
                //valorant
                const ValApiCom = new valorant_api_com_1.Client();
                const ValClient = new web_client_1.Client({
                    region: "ap",
                });
                ValClient.on('error', ((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield ValDatabase.model.deleteMany({ userId: _token.userId });
                    throw new Error('ValClient Error');
                })));
                //settings
                if (!ValDatabaseDaily.isFind) {
                    yield ValDatabase.model.deleteMany({ discordId: _token.userId });
                    continue;
                }
                ValClient.fromJSON(JSON.parse((0, crypto_1.decrypt)(ValDatabase.once.account, (0, crypto_1.genarateApiKey)(_token.user, _token.guild, process.env['PUBLIC_KEY']))));
                yield ValClient.refresh(true);
                /**
                 * Get Offers
                 */
                const getCurency = yield ValApiCom.Currencies.get();
                const getOffers = yield ValClient.Store.GetOffers();
                const GetWeaponSkin = yield ValApiCom.Weapons.getSkins();
                function getOffersOf(ItemsId) {
                    var _a, _b, _c;
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                const _channel = DiscordClient.channels.cache.get(_token.channelId);
                if ((_channel === null || _channel === void 0 ? void 0 : _channel.isText()) || (_channel === null || _channel === void 0 ? void 0 : _channel.isThread())) {
                    yield _channel.send({
                        content: `This is the store of ${discord_js_1.Formatters.userMention(_token.userId)} today in Valorant\n\nTime Left: **${_time.all.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`,
                        embeds: sendMessageArray,
                    });
                    yield core_1.Logs.log(`<${_token.userId}> sented today store in Valorant`, 'info');
                }
                else {
                    yield ValDatabaseDaily.model.deleteMany({ userId: _token.userId });
                }
            }
            catch (error) {
                yield core_1.Logs.log(`<${_token.userId}> failed to send today store in Valorant`, 'error');
                continue;
            }
        }
    });
}
exports.default = dailyStoreTrigger;
;
