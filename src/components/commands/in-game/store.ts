// import

import { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } from "discord.js";
import type { ICommandHandler } from "../../../modules";

import { ValorAccount } from "../../../utils/accounts";

// script

const __command: ICommandHandler.File = {
    command: new SlashCommandBuilder()
        .setName("store")
        .setDescription("Store")
        .addSubcommand((subcommand) => subcommand.setName("offers").setDescription("Daily Store"))
        .addSubcommand((subcommand) =>
            subcommand.setName("collection").setDescription("Current Bundle")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("bonus_store")
                .setDescription("Night Market")
                .addBooleanOption((option) =>
                    option.setName("show_hidden").setDescription("Show All Items")
                )
        ),
    category: "valorant",
    echo: {
        data: [
            {
                oldName: "offers",
                newName: "todaystore"
            },
            {
                oldName: "bonus_store",
                newName: "nightmarket"
            }
        ]
    },
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        // load

        const userId = interaction.user.id;
        const thisSubCommand = interaction.options.getSubcommand();

        const { WebClient, ValorantApiCom, isValorAccountFind } = await ValorAccount({
            userId,
            apiKey,
            language: language.name
        });

        if (isValorAccountFind === false) {
            return {
                content: language.data.command["account"]["not_account"]
            };
        }

        // script

        const puuid = WebClient.getSubject();

        const ValorantStore = await WebClient.Store.getStorefront(puuid);

        // function
        const getCurency = await ValorantApiCom.Currencies.get();
        const getOffers = await WebClient.Store.getOffers();
        const GetWeaponSkin = await ValorantApiCom.Weapons.getSkins();

        async function getOffersOf(ItemsId: string) {
            let Store_ItemID = "";
            let Store_Quantity = "";
            let Store_ID = "";
            let Store_Cost = "";
            let Store_Curency_Name = "VP";
            let Store_Curency_ID = "";

            // Main //
            for (const TheOffer of getOffers.data.Offers) {
                for (const _offer of TheOffer.Rewards) {
                    Store_ItemID = _offer.ItemID;
                    Store_Quantity = _offer.Quantity;

                    if (Store_ItemID === ItemsId) {
                        Store_ID = TheOffer.OfferID;

                        if (!getCurency.isRequestError && getCurency.data.data) {
                            for (const _currency of getCurency.data.data) {
                                Store_Cost = TheOffer.Cost[_currency.uuid];

                                Store_Curency_Name = _currency.displayName as string;
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
            let Store_ContentTier_ID = "";

            if (!GetWeaponSkin.isRequestError && GetWeaponSkin.data.data) {
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
            let Store_ContentTier_Name = "";
            let Store_ContentTier_Display = "";

            const GetContentTier = await ValorantApiCom.ContentTiers.getByUuid(
                String(Store_ContentTier_ID)
            );
            Store_ContentTier_Name = String(GetContentTier.data.data?.devName);
            Store_ContentTier_Display = String(GetContentTier.data.data?.displayIcon);

            // color
            const ContentTiersColor = String(GetContentTier.data.data?.highlightColor);
            const _Color = ContentTiersColor.substring(0, ContentTiersColor.length - 2);

            // display

            let Store_Display_Name = "";
            let Store_Display_Icon = "";
            const GetWeaponSkinLevel = await ValorantApiCom.Weapons.getSkinLevels();
            if (!GetWeaponSkinLevel.isRequestError && GetWeaponSkinLevel.data.data) {
                for (const _SkinLevel of GetWeaponSkinLevel.data.data) {
                    if (_SkinLevel.uuid === Store_ItemID) {
                        Store_Display_Name = _SkinLevel.displayName as string;
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
                    Id: Store_Curency_ID
                },
                ContentTier: {
                    Id: Store_ContentTier_ID,
                    Name: Store_ContentTier_Name,
                    Display: Store_ContentTier_Display,
                    Color: _Color
                },
                Display: {
                    Name: Store_Display_Name,
                    Icon: Store_Display_Icon
                }
            };
        }

        if (thisSubCommand === "offers") {
            // load

            const TimeLeft = Number(
                ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds
            );
            const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers;

            const sendMessageArray: Array<EmbedBuilder> = [];

            // script

            for (const ofItemID in AllOffers) {
                const ItemID = AllOffers[ofItemID];
                const _Offer = await getOffersOf(ItemID);

                let sendMessage = ``;
                sendMessage += `Price: **${_Offer.Cost} ${_Offer.Curency.Name}**\n`;
                sendMessage += `Slot: **${Number(ofItemID) + 1}**\n`;

                const createEmbed = new EmbedBuilder()
                    .setColor(`#${_Offer.ContentTier.Color}`)
                    .setTitle(_Offer.Display.Name)
                    .setDescription(sendMessage)
                    .setThumbnail(_Offer.Display.Icon)
                    .setAuthor({
                        name: _Offer.ContentTier.Name,
                        iconURL: _Offer.ContentTier.Display
                    });

                sendMessageArray.push(createEmbed);
            }

            // return

            return {
                content: `Time Left: **${time(
                    new Date(createdTime.getTime() + TimeLeft * 1000),
                    TimestampStyles.RelativeTime
                )}**`,
                embeds: sendMessageArray
            };
        }

        if (thisSubCommand === "collection") {
            // load

            const sendMessageArray = [];

            // script

            for (const ofTheBundle in ValorantStore.data.FeaturedBundle.Bundles) {
                const TheBundle = ValorantStore.data.FeaturedBundle.Bundles[ofTheBundle];

                const ThisBundleId = TheBundle.DataAssetID;
                const ThisBundleCurrency = TheBundle.CurrencyID;

                const ThisBundleData = await ValorantApiCom.Bundles.getByUuid(ThisBundleId);
                if (!ThisBundleData.data.data) {
                    throw new Error(ThisBundleData.data.error);
                }

                const TimeLeft = Number(TheBundle.DurationRemainingInSeconds);

                // const isNeedToBuyWholesaleOnly = Boolean(TheBundle.WholesaleOnly);

                // price
                let Price_Base = 0;
                let Price_Discounted = 0;
                const AllItems = TheBundle.Items as Array<{
                    Item: {
                        ItemTypeID: string;
                        ItemID: string;
                        Amount: number;
                    };
                    BasePrice: number;
                    CurrencyID: string;
                    DiscountPercent: number;
                    DiscountedPrice: number;
                    IsPromoItem: boolean;
                }>;

                for (const ofItem of AllItems) {
                    Price_Base += ofItem.BasePrice;
                    Price_Discounted += ofItem.DiscountedPrice;
                }

                // currency
                const GetCurrency = await ValorantApiCom.Currencies.getByUuid(ThisBundleCurrency);
                if (GetCurrency.isRequestError || !GetCurrency.data.data) {
                    throw new Error(GetCurrency.data.error);
                }

                const ThePrice = GetCurrency.data.data.displayName;

                const Price_DiscountCosts: number =
                    ((Price_Base - Price_Discounted) / Price_Base) * 100;

                // embed
                const createEmbed = new EmbedBuilder()
                    .setImage(ThisBundleData.data.data?.displayIcon as string)
                    .addFields({
                        name: `Name`,
                        value: `${ThisBundleData.data.data.displayName}`,
                        inline: true
                    });

                if (Price_Base === Price_Discounted) {
                    createEmbed.addFields({
                        name: `Price`,
                        value: `${Price_Base}`,
                        inline: true
                    });
                } else {
                    createEmbed.addFields({
                        name: `Price`,
                        value: `~~${Price_Base}~~ *-->* **${Price_Discounted} ${ThePrice} (-${Math.ceil(
                            Price_DiscountCosts
                        )}%)**`,
                        inline: true
                    });
                }
                createEmbed.addFields(
                    {
                        name: "\u200B",
                        value: "\u200B"
                    },
                    {
                        name: `Time Remaining`,
                        value: `${time(
                            new Date(createdTime.getTime() + TimeLeft * 1000),
                            TimestampStyles.RelativeTime
                        )}`,
                        inline: true
                    }
                );

                sendMessageArray.push(createEmbed);
            }

            // return

            return {
                embeds: sendMessageArray
            };
        }

        if (thisSubCommand === "bonus_store") {
            // load

            if (!ValorantStore.data.BonusStore) {
                return {
                    content: `${language.data.command["store"]["not_nightmarket"]}`
                };
            }

            const ForceToShow = interaction.options.getBoolean("show_hidden") || false;
            const TimeLeft = Number(
                ValorantStore.data.BonusStore.BonusStoreRemainingDurationInSeconds
            );

            const _BonusStore = ValorantStore.data.BonusStore.BonusStoreOffers;

            const sendMessageArray: Array<EmbedBuilder> = [];

            // script

            for (const ofItem in _BonusStore) {
                const ThisBonusStore = _BonusStore[ofItem];
                const ItemId = ThisBonusStore.Offer.Rewards[0].ItemID;

                // script
                const DiscountPercent = ThisBonusStore.DiscountPercent;
                const IsSeen = Boolean(ThisBonusStore.IsSeen);

                if (!IsSeen && !ForceToShow) continue;

                const _Offer = await getOffersOf(ItemId);
                const DiscountCosts = ThisBonusStore.DiscountCosts[_Offer.Curency.Id];

                let sendMessage = ``;
                sendMessage += `Price: ~~${_Offer.Cost}~~ *-->* **${DiscountCosts} ${_Offer.Curency.Name} (-${DiscountPercent}%)**\n`;
                sendMessage += `Slot: **${Number(ofItem) + 1}**\n`;

                sendMessageArray.push(
                    new EmbedBuilder()
                        .setColor(`#${_Offer.ContentTier.Color}`)
                        .setTitle(_Offer.Display.Name)
                        .setDescription(sendMessage)
                        .setThumbnail(_Offer.Display.Icon)
                        .setAuthor({
                            name: _Offer.ContentTier.Name,
                            iconURL: _Offer.ContentTier.Display
                        })
                );
            }

            let _message = `Time Left: **${time(
                new Date(createdTime.getTime() + TimeLeft * 1000),
                TimestampStyles.RelativeTime
            )}**`;
            if (sendMessageArray.length === 0) {
                _message += `\n\n${language.data.command["store"]["no_nightmarket"]}`;
            }

            // return

            return {
                content: _message,
                embeds: sendMessageArray
            };
        }

        return {
            content: language.data.error
        };
    }
};

// export

export default __command;
