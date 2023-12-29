import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandBooleanOption,
    EmbedBuilder,
    Colors,
    bold,
    time,
    TimestampStyles,
    strikethrough,
    italic
} from "discord.js";

import { WebClient, ValorantApiCom, Locale, ItemTypeId } from "valorant.ts";
import type { Store } from "@valapi/web-client";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(
    new SlashCommandBuilder()
        .setName("store")
        .setDescription("store")
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("weapon").setDescription("weapons"))
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("bundle").setDescription("bundles"))
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("nightmarket")
                .setDescription("night market")
                .addBooleanOption(new SlashCommandBooleanOption().setName("hidden").setDescription("hide unopen nightmarket slot (default: true)"))
        )
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("accessory").setDescription("accessories")),
    async (interaction) => {
        const saved = await Account.fetch(interaction.user.id);

        if (saved) {
            const webClient = WebClient.fromJSON(saved);
            const valorantApiCom = new ValorantApiCom({
                language: Locale.Default.English_United_States
            });

            const subject = webClient.getSubject();

            await interaction.deferReply();

            const _subcommand = interaction.options.getSubcommand();

            const weaponSkins = await valorantApiCom.Weapons.getSkins();
            if (!weaponSkins.data.data) {
                await interaction.editReply(Command.errorReply);
                return;
            }

            const GetOffers = async (offers: Array<Store.Offer | undefined>) => {
                if (!weaponSkins.data.data) return [];

                const items: Array<undefined | null | {
                    name: string;
                    icon: string;
                    contentTier: {
                        name: string | undefined;
                        icon: string | undefined;
                        color: string | undefined;
                    },
                    cost: {
                        id: string;
                        price: number;
                        name: string | undefined;
                    }
                }> = offers.map(offer => offer == undefined ? undefined : null);

                for (const weapon of weaponSkins.data.data) {
                    for (const level of weapon.levels) {
                        for (const itemIndex in offers) {
                            const item = offers[itemIndex];

                            if (item == undefined) continue;

                            if (level.uuid === item.OfferID) {
                                const contentTier = await valorantApiCom.ContentTiers.getByUuid(weapon.contentTierUuid);

                                const currencyId = Object.keys(item.Cost)[0];
                                const currency = await valorantApiCom.Currencies.getByUuid(currencyId);

                                items[Number.parseInt(itemIndex)] = {
                                    name: weapon.displayName,
                                    icon: weapon.chromas[0].fullRender,
                                    contentTier: {
                                        name: contentTier.data.data?.displayName,
                                        icon: contentTier.data.data?.displayIcon,
                                        color: contentTier.data.data?.highlightColor
                                    },
                                    cost: {
                                        id: currencyId,
                                        price: item.Cost[currencyId],
                                        name: currency.data.data?.displayName
                                    }
                                };
                            }
                        }
                    }
                }

                return items;
            };

            const storefront = await webClient.Store.getStorefront(subject);

            if (_subcommand === "weapon") {
                const items = await GetOffers(storefront.data.SkinsPanelLayout.SingleItemStoreOffers);

                const weaponEmbeds: Array<EmbedBuilder> = [];
                for (const item of items) {
                    if (item != undefined)
                        weaponEmbeds.push(
                            new EmbedBuilder()
                                .setTitle(item.name)
                                .setDescription(bold(`${item.cost.price} ${item.cost.name}`))
                                .setThumbnail(item.icon)
                                .setAuthor({
                                    name: String(item.contentTier.name),
                                    iconURL: item.contentTier.icon
                                })
                                .setColor(`#${item.contentTier.color?.slice(0, -2)}` || null)
                        );
                }

                await interaction.editReply({
                    content: `Time Remaining: ${bold(
                        time(
                            Math.round(Date.now() / 1000 + storefront.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds),
                            TimestampStyles.RelativeTime
                        )
                    )}`,
                    embeds: weaponEmbeds
                });
            } else if (_subcommand === "bundle") {
                const bundleEmbeds: Array<EmbedBuilder> = [];
                for (const bundle of storefront.data.FeaturedBundle.Bundles) {
                    const bundleData = await valorantApiCom.Bundles.getByUuid(bundle.DataAssetID);
                    const currency = await valorantApiCom.Currencies.getByUuid(bundle.CurrencyID);

                    bundleEmbeds.push(
                        new EmbedBuilder()
                            .setTitle(bundleData.data.data?.displayName || null)
                            .setDescription(
                                bundleData.data.data?.extraDescription
                                    ? bundleData.data.data.extraDescription
                                    : bundleData.data.data?.description
                                      ? bundleData.data.data.description
                                      : null
                            )
                            .addFields([
                                {
                                    name: "Price",
                                    value:
                                        bundle.WholesaleOnly || bundle.TotalBaseCost[bundle.CurrencyID] === bundle.TotalDiscountedCost[bundle.CurrencyID]
                                            ? `${bundle.TotalBaseCost[bundle.CurrencyID].toString()} ${currency.data.data?.displayName}`
                                            : `${strikethrough(bundle.TotalBaseCost[bundle.CurrencyID].toString())} ${italic("-->")} ${bold(
                                                  `${bundle.TotalDiscountedCost[bundle.CurrencyID]} ${currency.data.data?.displayName} (-${
                                                      bundle.TotalDiscountPercent * 100
                                                  }%)`
                                              )}`,
                                    inline: true
                                },
                                {
                                    name: `Time Remaining`,
                                    value: `${time(Math.round(Date.now() / 1000 + bundle.DurationRemainingInSeconds), TimestampStyles.RelativeTime)}`,
                                    inline: true
                                }
                            ])
                            .setImage(bundleData.data.data?.displayIcon || null)
                            .setColor(Colors.Aqua)
                    );
                }

                await interaction.editReply({
                    embeds: bundleEmbeds
                });
            } else if (_subcommand === "nightmarket") {
                if (storefront.data.BonusStore) {
                    const _isHidden = interaction.options.getBoolean("hidden");
                    const isHidden = _isHidden == null ? true : _isHidden;

                    const offers = [];
                    for (const item of storefront.data.BonusStore.BonusStoreOffers) {
                        if (!item.IsSeen && isHidden) {
                            offers.push(undefined);
                            continue;
                        }

                        offers.push(item.Offer);
                    }

                    const items = await GetOffers(offers);

                    const bonusEmbed: Array<EmbedBuilder> = [];

                    for (const itemIndex in storefront.data.BonusStore.BonusStoreOffers) {
                        const item = storefront.data.BonusStore.BonusStoreOffers[itemIndex];
                        const offer = items[Number.parseInt(itemIndex)];
                        if (offer == undefined) continue;

                        bonusEmbed.push(
                            new EmbedBuilder()
                                .setTitle(offer.name)
                                .setDescription(
                                    `${strikethrough(`${offer.cost.price}`)} ${italic(`-->`)} ${bold(
                                        `${item.DiscountCosts[offer.cost.id]} ${offer.cost.name} (-${item.DiscountPercent}%)`
                                    )}`
                                )
                                .setThumbnail(offer.icon)
                                .setAuthor({
                                    name: String(offer.contentTier.name),
                                    iconURL: offer.contentTier.icon
                                })
                                .setColor(`#${offer.contentTier.color?.slice(0, -2)}` || null)
                        );
                    }

                    await interaction.editReply({
                        content: `Time Remaining: ${bold(
                            time(
                                Math.round(Date.now() / 1000 + storefront.data.BonusStore.BonusStoreRemainingDurationInSeconds),
                                TimestampStyles.RelativeTime
                            )
                        )}`,
                        embeds: bonusEmbed
                    });
                } else {
                    await interaction.editReply({
                        embeds: [new EmbedBuilder().setTitle("Night Market Not Found").setColor(Colors.Red)]
                    });
                }
            } else if (_subcommand === "accessory") {
                const kingdomCreditName = "Kingdom Credits";
                const kingdomCreditId = "85ca954a-41f2-ce94-9b45-8ca3dd39a00d";

                const accessoryEmbed: Array<EmbedBuilder> = [];

                for (const accessory of storefront.data.AccessoryStore.AccessoryStoreOffers) {
                    if (!accessory.Offer.Rewards[0]) continue;

                    const itemType = ItemTypeId.fromString(<ItemTypeId.Identify>accessory.Offer.Rewards[0].ItemTypeID);

                    switch (itemType) {
                        case "Sprays": {
                            const spray = await valorantApiCom.Sprays.getByUuid(accessory.Offer.Rewards[0].ItemID);
                            if (!spray.data.data) {
                                await interaction.editReply(Command.errorReply);
                                return;
                            }

                            accessoryEmbed.push(
                                new EmbedBuilder()
                                    .setColor(Colors.Aqua)
                                    .setTitle(spray.data.data.displayName)
                                    .setDescription(`Price: ${bold(`${accessory.Offer.Cost[kingdomCreditId]} ${kingdomCreditName}`)}`)
                                    .setThumbnail(spray.data.data.animationGif || spray.data.data.fullTransparentIcon || spray.data.data.displayIcon)
                            );
                            break;
                        }
                        case "Gun_Buddies": {
                            const buddy = await valorantApiCom.Buddies.getLevelByUuid(accessory.Offer.Rewards[0].ItemID);
                            if (!buddy.data.data) {
                                await interaction.editReply(Command.errorReply);
                                return;
                            }

                            accessoryEmbed.push(
                                new EmbedBuilder()
                                    .setColor(Colors.Aqua)
                                    .setTitle(buddy.data.data.displayName)
                                    .setDescription(`Price: ${bold(`${accessory.Offer.Cost[kingdomCreditId]} ${kingdomCreditName}`)}`)
                                    .setThumbnail(buddy.data.data.displayIcon)
                            );
                            break;
                        }
                        case "Cards": {
                            const playerCard = await valorantApiCom.PlayerCards.getByUuid(accessory.Offer.Rewards[0].ItemID);
                            if (!playerCard.data.data) {
                                await interaction.editReply(Command.errorReply);
                                return;
                            }

                            accessoryEmbed.push(
                                new EmbedBuilder()
                                    .setColor(Colors.Aqua)
                                    .setTitle(playerCard.data.data.displayName)
                                    .setDescription(`Price: ${bold(`${accessory.Offer.Cost[kingdomCreditId]} ${kingdomCreditName}`)}`)
                                    .setImage(playerCard.data.data.wideArt)
                            );
                            break;
                        }
                        case "Titles": {
                            const title = await valorantApiCom.PlayerTitles.getByUuid(accessory.Offer.Rewards[0].ItemID);
                            if (!title.data.data) {
                                await interaction.editReply(Command.errorReply);
                                return;
                            }

                            accessoryEmbed.push(
                                new EmbedBuilder()
                                    .setColor(Colors.Aqua)
                                    .setTitle(title.data.data.titleText)
                                    .setDescription(
                                        `${title.data.data.displayName}\n\nPrice: ${bold(`${accessory.Offer.Cost[kingdomCreditId]} ${kingdomCreditName}`)}`
                                    )
                            );
                            break;
                        }
                        default: {
                            continue;
                        }
                    }
                }

                await interaction.editReply({
                    content: `Time Remaining: ${bold(
                        time(
                            Math.round(Date.now() / 1000 + storefront.data.AccessoryStore.AccessoryStoreRemainingDurationInSeconds),
                            TimestampStyles.RelativeTime
                        )
                    )}`,
                    embeds: accessoryEmbed
                });
            }
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
                ephemeral: true
            });
        }
    }
);
