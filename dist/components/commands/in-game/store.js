"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('store')
        .setDescription('Store')
        .addSubcommand(subcommand => subcommand
        .setName('offers')
        .setDescription('Daily Store'))
        .addSubcommand(subcommand => subcommand
        .setName('collection')
        .setDescription('Current Bundle'))
        .addSubcommand(subcommand => subcommand
        .setName('bonus_store')
        .setDescription('Night Market')
        .addBooleanOption(option => option
        .setName('show_hidden')
        .setDescription('Show All Items')))),
    category: 'valorant',
    echo: {
        data: [
            { oldName: 'offers', newName: 'todaystore' },
            { oldName: 'bonus_store', newName: 'nightmarket' },
        ],
    },
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const thisSubCommand = interaction.options.getSubcommand();
            const { WebClient, ValorantApiCom, isValorAccountFind } = yield (0, accounts_1.ValorAccount)({
                userId,
                apiKey,
                language: language.name,
            });
            if (isValorAccountFind === false) {
                return {
                    content: language.data.command['account']['not_account'],
                };
            }
            const puuid = WebClient.getSubject();
            const ValorantStore = yield WebClient.Store.getStorefront(puuid);
            const getCurency = yield ValorantApiCom.Currencies.get();
            const getOffers = yield WebClient.Store.getOffers();
            const GetWeaponSkin = yield ValorantApiCom.Weapons.getSkins();
            function getOffersOf(ItemsId) {
                var _a, _b, _c;
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    let Store_ItemID = '';
                    let Store_Quantity = '';
                    let Store_ID = '';
                    let Store_Cost = '';
                    let Store_Curency_Name = 'VP';
                    let Store_Curency_ID = '';
                    for (const TheOffer of getOffers.data.Offers) {
                        for (const _offer of TheOffer.Rewards) {
                            Store_ItemID = _offer.ItemID;
                            Store_Quantity = _offer.Quantity;
                            if (Store_ItemID === ItemsId) {
                                Store_ID = TheOffer.OfferID;
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
                    let Store_ContentTier_Name = '';
                    let Store_ContentTier_Display = '';
                    const GetContentTier = yield ValorantApiCom.ContentTiers.getByUuid(String(Store_ContentTier_ID));
                    Store_ContentTier_Name = String((_a = GetContentTier.data.data) === null || _a === void 0 ? void 0 : _a.devName);
                    Store_ContentTier_Display = String((_b = GetContentTier.data.data) === null || _b === void 0 ? void 0 : _b.displayIcon);
                    const ContentTiersColor = String((_c = GetContentTier.data.data) === null || _c === void 0 ? void 0 : _c.highlightColor);
                    const _Color = ContentTiersColor.substring(0, ContentTiersColor.length - 2);
                    let Store_Display_Name = '';
                    let Store_Display_Icon = '';
                    const GetWeaponSkinLevel = yield ValorantApiCom.Weapons.getSkinLevels();
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
            if (thisSubCommand === 'offers') {
                const TimeLeft = Number(ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds);
                const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers;
                const sendMessageArray = [];
                for (const ofItemID in AllOffers) {
                    const ItemID = AllOffers[ofItemID];
                    const _Offer = yield getOffersOf(ItemID);
                    let sendMessage = ``;
                    sendMessage += `Price: **${_Offer.Cost} ${_Offer.Curency.Name}**\n`;
                    sendMessage += `Slot: **${Number(ofItemID) + 1}**\n`;
                    const createEmbed = new discord_js_1.EmbedBuilder()
                        .setColor(`#${_Offer.ContentTier.Color}`)
                        .setTitle(_Offer.Display.Name)
                        .setDescription(sendMessage)
                        .setThumbnail(_Offer.Display.Icon)
                        .setAuthor({ name: _Offer.ContentTier.Name, iconURL: _Offer.ContentTier.Display });
                    sendMessageArray.push(createEmbed);
                }
                return {
                    content: `Time Left: **${(0, discord_js_1.time)(new Date(createdTime.getTime() + (TimeLeft * 1000)), discord_js_1.TimestampStyles.RelativeTime)}**`,
                    embeds: sendMessageArray,
                };
            }
            if (thisSubCommand === 'collection') {
                const sendMessageArray = [];
                for (const ofTheBundle in ValorantStore.data.FeaturedBundle.Bundles) {
                    const TheBundle = ValorantStore.data.FeaturedBundle.Bundles[ofTheBundle];
                    const ThisBundleId = TheBundle.DataAssetID;
                    const ThisBundleCurrency = TheBundle.CurrencyID;
                    const ThisBundleData = yield ValorantApiCom.Bundles.getByUuid(ThisBundleId);
                    if (!ThisBundleData.data.data) {
                        throw new Error(ThisBundleData.data.error);
                    }
                    const TimeLeft = Number(TheBundle.DurationRemainingInSeconds);
                    let Price_Base = 0;
                    let Price_Discounted = 0;
                    const AllItems = TheBundle.Items;
                    for (const ofItem of AllItems) {
                        Price_Base += ofItem.BasePrice;
                        Price_Discounted += ofItem.DiscountedPrice;
                    }
                    const GetCurrency = yield ValorantApiCom.Currencies.getByUuid(ThisBundleCurrency);
                    if (GetCurrency.isError || !GetCurrency.data.data) {
                        throw new Error(GetCurrency.data.error);
                    }
                    const ThePrice = GetCurrency.data.data.displayName;
                    const Price_DiscountCosts = (Price_Base - Price_Discounted) / Price_Base * 100;
                    const createEmbed = new discord_js_1.EmbedBuilder()
                        .setImage((_a = ThisBundleData.data.data) === null || _a === void 0 ? void 0 : _a.displayIcon)
                        .addFields({ name: `Name`, value: `${ThisBundleData.data.data.displayName}`, inline: true });
                    if (Price_Base === Price_Discounted) {
                        createEmbed.addFields({ name: `Price`, value: `${Price_Base}`, inline: true });
                    }
                    else {
                        createEmbed.addFields({ name: `Price`, value: `~~${Price_Base}~~ *-->* **${Price_Discounted} ${ThePrice} (-${Math.ceil(Price_DiscountCosts)}%)**`, inline: true });
                    }
                    createEmbed.addFields({ name: '\u200B', value: '\u200B' }, { name: `Time Remaining`, value: `${(0, discord_js_1.time)(new Date(createdTime.getTime() + (TimeLeft * 1000)), discord_js_1.TimestampStyles.RelativeTime)}`, inline: true });
                    sendMessageArray.push(createEmbed);
                }
                return {
                    embeds: sendMessageArray,
                };
            }
            if (thisSubCommand === 'bonus_store') {
                if (!ValorantStore.data.BonusStore) {
                    return {
                        content: `${language.data.command['store']['not_nightmarket']}`,
                    };
                }
                const ForceToShow = interaction.options.getBoolean('show_hidden') || false;
                const TimeLeft = Number(ValorantStore.data.BonusStore.BonusStoreRemainingDurationInSeconds);
                const _BonusStore = ValorantStore.data.BonusStore.BonusStoreOffers;
                const sendMessageArray = [];
                for (const ofItem in _BonusStore) {
                    const ThisBonusStore = _BonusStore[ofItem];
                    const ItemId = ThisBonusStore.Offer.Rewards[0].ItemID;
                    const DiscountPercent = ThisBonusStore.DiscountPercent;
                    const IsSeen = Boolean(ThisBonusStore.IsSeen);
                    if (!IsSeen && !ForceToShow)
                        continue;
                    const _Offer = yield getOffersOf(ItemId);
                    const DiscountCosts = ThisBonusStore.DiscountCosts[_Offer.Curency.Id];
                    let sendMessage = ``;
                    sendMessage += `Price: ~~${_Offer.Cost}~~ *-->* **${DiscountCosts} ${_Offer.Curency.Name} (-${DiscountPercent}%)**\n`;
                    sendMessage += `Slot: **${Number(ofItem) + 1}**\n`;
                    sendMessageArray.push(new discord_js_1.EmbedBuilder()
                        .setColor(`#${_Offer.ContentTier.Color}`)
                        .setTitle(_Offer.Display.Name)
                        .setDescription(sendMessage)
                        .setThumbnail(_Offer.Display.Icon)
                        .setAuthor({ name: _Offer.ContentTier.Name, iconURL: _Offer.ContentTier.Display }));
                }
                let _message = `Time Left: **${(0, discord_js_1.time)(new Date(createdTime.getTime() + (TimeLeft * 1000)), discord_js_1.TimestampStyles.RelativeTime)}**`;
                if (sendMessageArray.length === 0) {
                    _message += `\n\n${language.data.command['store']['no_nightmarket']}`;
                }
                return {
                    content: _message,
                    embeds: sendMessageArray,
                };
            }
            return {
                content: language.data.error
            };
        });
    }
};
exports.default = __command;
