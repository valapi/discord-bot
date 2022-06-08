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
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
//valorant
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
//extend
const Milliseconds_1 = require("@ing3kth/core/dist/utils/Milliseconds");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('store')
        .setDescription('Valorant Store')
        .addSubcommand(subcommand => subcommand
        .setName('daily')
        .setDescription('Daily Store')
        .addBooleanOption(option => option
        .setName('notify_everyday')
        .setDescription('Sent your daily store at this channel every day (Work In Progress)')))
        .addSubcommand(subcommand => subcommand
        .setName('bundle')
        .setDescription('Current Bundle'))
        .addSubcommand(subcommand => subcommand
        .setName('night_market')
        .setDescription('Night Market')
        .addBooleanOption(option => option
        .setName('show_hidden')
        .setDescription('Show All Items'))),
    type: 'valorant',
    echo: {
        command: [
            {
                newCommandName: 'todaystore',
                subCommandName: 'daily',
            },
            {
                newCommandName: 'nightmarket',
                subCommandName: 'night_market',
            },
        ],
    },
    onlyGuild: true,
    execute({ interaction, language, apiKey }) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const _subCommand = interaction.options.getSubcommand();
            const ValDatabase = (yield database_1.ValData.verify()).getCollection('account', database_1.ValorantSchema);
            const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: userId });
            //valorant
            const ValApiCom = new valorant_api_com_1.Client({
                language: (language.name).replace('_', '-'),
            });
            const SaveAccount = ValAccountInDatabase.once.account;
            const ValClient = api_wrapper_1.Client.fromJSON({
                region: "ap",
            }, JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            yield ValClient.reconnect(false);
            //get
            if (!ValAccountInDatabase.isFind) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const ValorantStore = yield ValClient.Store.GetStorefront(puuid);
            //function
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
            if (_subCommand === 'daily') {
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
                //sendMessage
                yield interaction.editReply({
                    content: `Time Left: **${_time.all.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`,
                    embeds: sendMessageArray,
                });
                //send me every day
                const ValSaveDatabase = (yield database_1.ValData.verify()).getCollection('daily', database_1.SaveSchema);
                const StoreNotify = interaction.options.getBoolean('notify_everyday');
                if (typeof StoreNotify !== 'boolean') {
                    return;
                }
                yield ValSaveDatabase.deleteMany({ userId: userId });
                if (StoreNotify === false) {
                    return;
                }
                const SaveAccount = new ValSaveDatabase({
                    user: interaction.user.id + interaction.user.createdTimestamp + interaction.user.username + interaction.user.tag,
                    userId: interaction.user.id,
                    guild: ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) + ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.ownerId) + String((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.createdTimestamp),
                    channelId: (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.id,
                });
                yield SaveAccount.save();
            }
            else if (_subCommand === 'bundle') {
                //work in progress
                let sendMessageArray = [];
                for (const ofTheBundle in ValorantStore.data.FeaturedBundle.Bundles) {
                    const TheBundle = ValorantStore.data.FeaturedBundle.Bundles[ofTheBundle];
                    const ThisBundleId = TheBundle.DataAssetID;
                    const ThisBundleCurrency = TheBundle.CurrencyID;
                    const ThisBundleData = yield ValApiCom.Bundles.getByUuid(ThisBundleId);
                    if (!ThisBundleData.data.data) {
                        throw new Error(ThisBundleData.data.error);
                    }
                    const TimeLeft = Number(TheBundle.DurationRemainingInSeconds);
                    const TimeInMillisecondFormat = (0, Milliseconds_1.ToMilliseconds)(TimeLeft * 1000);
                    const isNeedToBuyWholesaleOnly = Boolean(TheBundle.WholesaleOnly);
                    //price
                    let Price_Base = 0;
                    let Price_Discounted = 0;
                    const AllItems = TheBundle.Items;
                    for (let ofItem of AllItems) {
                        Price_Base += ofItem.BasePrice;
                        Price_Discounted += ofItem.DiscountedPrice;
                    }
                    //currency
                    const GetCurrency = yield ValApiCom.Currencies.getByUuid(ThisBundleCurrency);
                    if (GetCurrency.isError || !GetCurrency.data.data) {
                        throw new Error(GetCurrency.data.error);
                    }
                    let ThePrice = GetCurrency.data.data.displayName;
                    let Price_DiscountCosts = (Price_Base - Price_Discounted) / Price_Base * 100;
                    //embed
                    const createEmbed = new discord_js_1.MessageEmbed()
                        .setImage((_e = ThisBundleData.data.data) === null || _e === void 0 ? void 0 : _e.displayIcon)
                        .addFields({ name: `Name`, value: `${ThisBundleData.data.data.displayName}`, inline: true });
                    if (Price_Base === Price_Discounted) {
                        createEmbed.addField(`Price`, `${Price_Base}`, true);
                    }
                    else {
                        createEmbed.addField(`Price`, `~~${Price_Base}~~ *-->* **${Price_Discounted} ${ThePrice} (-${Math.ceil(Price_DiscountCosts)}%)**`, true);
                    }
                    createEmbed.addFields({ name: '\u200B', value: '\u200B' }, { name: `Time Remaining`, value: `${TimeInMillisecondFormat.data.day} day(s) ${TimeInMillisecondFormat.data.hour} hour(s) ${TimeInMillisecondFormat.data.minute} minute(s) ${TimeInMillisecondFormat.data.second} second(s)`, inline: true });
                    sendMessageArray.push(createEmbed);
                }
                yield interaction.editReply({
                    embeds: sendMessageArray,
                });
            }
            else if (_subCommand === 'night_market') {
                if (!ValorantStore.data.BonusStore) {
                    yield interaction.editReply({
                        content: `${language.data.command['store']['not_nightmarket']}`,
                    });
                    return;
                }
                else {
                    const ForceToShow = interaction.options.getBoolean('show_hidden') || false;
                    const TimeLeft = Number(ValorantStore.data.BonusStore.BonusStoreRemainingDurationInSeconds);
                    const _time = (0, Milliseconds_1.ToMilliseconds)(TimeLeft * 1000);
                    const _BonusStore = ValorantStore.data.BonusStore.BonusStoreOffers;
                    let sendMessageArray = [];
                    for (let ofItem in _BonusStore) {
                        const ThisBonusStore = _BonusStore[ofItem];
                        const ItemId = ThisBonusStore.Offer.Rewards[0].ItemID;
                        //script
                        let DiscountPercent = ThisBonusStore.DiscountPercent;
                        let IsSeen = Boolean(ThisBonusStore.IsSeen);
                        if (!IsSeen && !ForceToShow)
                            continue;
                        const _Offer = yield getOffersOf(ItemId);
                        let DiscountCosts = ThisBonusStore.DiscountCosts[_Offer.Curency.Id];
                        let sendMessage = ``;
                        sendMessage += `Price: ~~${_Offer.Cost}~~ *-->* **${DiscountCosts} ${_Offer.Curency.Name} (-${DiscountPercent}%)**\n`;
                        sendMessage += `Create At: **${_Offer.CreateTime.toUTCString()}**\n`;
                        sendMessage += `Slot: **${Number(ofItem) + 1}**\n`;
                        sendMessageArray.push(new discord_js_1.MessageEmbed()
                            .setColor(`#${_Offer.ContentTier.Color}`)
                            .setTitle(_Offer.Display.Name)
                            .setDescription(sendMessage)
                            .setThumbnail(_Offer.Display.Icon)
                            .setAuthor({ name: _Offer.ContentTier.Name, iconURL: _Offer.ContentTier.Display }));
                    }
                    let _message = `Time Left: **${_time.data.day} day(s) ${_time.data.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`;
                    if (sendMessageArray.length === 0) {
                        _message += `\n\n` + language.data.command['store']['no_nightmarket'];
                    }
                    yield interaction.editReply({
                        content: _message,
                        embeds: sendMessageArray,
                    });
                }
            }
        });
    }
};
//# sourceMappingURL=store.js.map