"use strict";
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
//common
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
//valorant common
const crypto_1 = require("../../utils/crypto");
const database_1 = require("../../utils/database");
//valorant
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
//extend
const Milliseconds_1 = require("@ing3kth/core/dist/utils/Milliseconds");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('store')
        .setDescription('Get Valorant Store'),
    permissions: [
        discord_js_1.Permissions.ALL,
    ],
    privateMessage: false,
    execute({ interaction, language, apiKey, DiscordClient, createdTime }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const ValApiCom = new valorant_api_com_1.Client();
            const ValDatabase = (yield database_1.ValData.verify()).getCollection();
            const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: userId });
            //valorant
            const ValClient = new api_wrapper_1.Client({
                region: "ap",
            });
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: language.data.error,
                });
                return;
            })));
            //get
            if (!ValAccountInDatabase.isFind) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const SaveAccount = ValAccountInDatabase.once.account;
            ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
            //success
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const ValorantStore = yield ValClient.Store.GetStorefront(puuid);
            const _time = (0, Milliseconds_1.ToMilliseconds)(ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds * 1000);
            //items
            const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers;
            let sendMessageArray = [];
            for (const ofItemsId in AllOffers) {
                const ItemsId = AllOffers[ofItemsId];
                //skin
                let Store_ItemID = '';
                let Store_Quantity = '';
                let Store_ID = '';
                let Store_Cost = '';
                let Store_Curency = 'VP';
                const getCurency = yield ValApiCom.Currencies.get();
                const getOffers = yield ValClient.Store.GetOffers();
                for (const TheOffer of getOffers.data.Offers) {
                    for (const _offer of TheOffer.Rewards) {
                        Store_ItemID = _offer.ItemID;
                        Store_Quantity = _offer.Quantity;
                        if (Store_ItemID === ItemsId) {
                            Store_ID = TheOffer.OfferID;
                            if (!getCurency.isError && getCurency.data.data) {
                                for (const _currency of getCurency.data.data) {
                                    Store_Cost = TheOffer.Cost[_currency.uuid];
                                    Store_Curency = _currency.displayName;
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
                //content tier
                let Store_ContentTier_ID = '';
                const GetWeaponSkin = yield ValApiCom.Weapons.getSkins();
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
                let Store_ContentTier_Name = '';
                let Store_ContentTier_Display = '';
                const GetContentTier = yield ValApiCom.ContentTiers.getByUuid(String(Store_ContentTier_ID));
                Store_ContentTier_Name = String((_a = GetContentTier.data.data) === null || _a === void 0 ? void 0 : _a.devName);
                Store_ContentTier_Display = String((_b = GetContentTier.data.data) === null || _b === void 0 ? void 0 : _b.displayIcon);
                //sendMessage
                let ContentTiersColor = String((_c = GetContentTier.data.data) === null || _c === void 0 ? void 0 : _c.highlightColor);
                const _Color = ContentTiersColor.substring(0, ContentTiersColor.length - 2);
                const GetWeaponSkinLevel = yield ValApiCom.Weapons.getSkinLevels();
                if (!GetWeaponSkinLevel.isError && GetWeaponSkinLevel.data.data) {
                    for (const _SkinLevel of GetWeaponSkinLevel.data.data) {
                        if (_SkinLevel.uuid === ItemsId) {
                            let sendMessage = ``;
                            sendMessage += `Price: **${Store_Cost} ${Store_Curency}**\n`;
                            sendMessage += `Slot: **${Number(ofItemsId) + 1}**\n`;
                            const createEmbed = new discord_js_1.MessageEmbed()
                                .setColor(`#${_Color}`)
                                .setTitle(_SkinLevel.displayName)
                                .setDescription(sendMessage)
                                .setThumbnail(_SkinLevel.displayIcon)
                                .setAuthor({ name: Store_ContentTier_Name, iconURL: Store_ContentTier_Display });
                            sendMessageArray.push(createEmbed);
                            break;
                        }
                    }
                }
            }
            //sendMessage
            yield interaction.editReply({
                content: `Time Left: **${_time.all.hour} hour(s) ${_time.all.minute} minute(s) ${_time.all.second} second(s)**`,
                embeds: sendMessageArray,
            });
        });
    }
};
//# sourceMappingURL=store.js.map