import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandBooleanOption, EmbedBuilder, Colors, bold, time, TimestampStyles, strikethrough, italic } from "discord.js";

import { WebClient, ValorantApiCom } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(
    new SlashCommandBuilder()
        .setName("store")
        .setDescription("store")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("daily")
                .setDescription("offers")
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("bundle")
                .setDescription("bundle")
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("nightmarket")
                .setDescription("night market")
                .addBooleanOption(
                    new SlashCommandBooleanOption()
                        .setName("hidden")
                        .setDescription("hide unopen nightmarket slot (default: true)")
                )
        ),
    async (interaction) => {
        const saved = await Account.fetchTmp(interaction.user.id);

        if (saved) {
            const webClient = WebClient.fromJSON(saved);
            const valorantApiCom = new ValorantApiCom();

            const subject = webClient.getSubject();

            await interaction.deferReply();

            const _subcommand = interaction.options.getSubcommand();

            const weaponSkins = await valorantApiCom.Weapons.getSkins();
            if (!weaponSkins.data.data) {
                await interaction.editReply(Command.errorReply);
                return;
            }

            if (_subcommand === "daily") {
                const storefront = await webClient.Store.getStorefront(subject);

                const items = [];
                weaponSkinsLoop:
                for (const weaponSkin of weaponSkins.data.data) {
                    for (const level of weaponSkin.levels) {
                        for (const itemOffer of storefront.data.SkinsPanelLayout.SingleItemStoreOffers) {
                            if (level.uuid === itemOffer.OfferID) {
                                const contentTier = await valorantApiCom.ContentTiers.getByUuid(weaponSkin.contentTierUuid);

                                const currencyId = Object.keys(itemOffer.Cost)[0];
                                const currency = await valorantApiCom.Currencies.getByUuid(currencyId);

                                items.push({
                                    name: weaponSkin.displayName.toString(),
                                    icon: weaponSkin.displayIcon,
                                    contentTier: {
                                        name: contentTier.data.data?.displayName.toString(),
                                        icon: contentTier.data.data?.displayIcon,
                                        color: contentTier.data.data?.highlightColor
                                    },
                                    cost: {
                                        price: itemOffer.Cost[currencyId],
                                        name: currency.data.data?.displayName,
                                    },
                                });

                                if (items.length === storefront.data.SkinsPanelLayout.SingleItemStoreOffers.length) {
                                    break weaponSkinsLoop;
                                } else {
                                    continue weaponSkinsLoop;
                                }
                            }
                        }
                    }
                }

                await interaction.editReply({
                    content: `Time Left: ${bold(time(Math.round((Date.now() / 1000) + storefront.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds), TimestampStyles.RelativeTime))}`,
                    embeds: items.map((item) => {
                        return new EmbedBuilder()
                            .setTitle(item.name)
                            .setDescription(`Price: ${bold(`${item.cost.price} ${item.cost.name}`)}`)
                            .setThumbnail(item.icon)
                            .setAuthor({
                                name: String(item.contentTier.name),
                                iconURL: item.contentTier.icon,
                            })
                            .setColor(`#${item.contentTier.color?.slice(0, -2)}` || null)
                    })
                });
            }
            else if (_subcommand === "bundle") {
                const storefront = await webClient.Store.getStorefront(subject);

                const bundleEmbeds: Array<EmbedBuilder> = [];
                for (const bundle of storefront.data.FeaturedBundle.Bundles) {
                    const bundleData = await valorantApiCom.Bundles.getByUuid(bundle.DataAssetID);
                    const currency = await valorantApiCom.Currencies.getByUuid(bundle.CurrencyID);

                    bundleEmbeds.push(
                        new EmbedBuilder()
                            .setTitle(bundleData.data.data?.displayName.toString() || null)
                            .setDescription(bundleData.data.data?.extraDescription ? String(bundleData.data.data.extraDescription) : bundleData.data.data?.description ? String(bundleData.data.data.description) : null)
                            .addFields([
                                {
                                    name: "Price",
                                    value: bundle.TotalBaseCost === bundle.TotalDiscountedCost 
                                        ? bundle.TotalBaseCost[bundle.CurrencyID].toString() 
                                        : `${strikethrough(bundle.TotalBaseCost[bundle.CurrencyID].toString())} ${italic("-->")} ${bold(`${bundle.TotalDiscountedCost[bundle.CurrencyID]} ${currency.data.data?.displayName} (-${bundle.TotalDiscountPercent * 100}%)`)}`,
                                    inline: true
                                },
                                {
                                    name: `Time Remaining`,
                                    value: `${time(Math.round((Date.now() / 1000) + bundle.DurationRemainingInSeconds), TimestampStyles.RelativeTime)}`,
                                    inline: true
                                }
                            ])
                            .setImage(bundleData.data.data?.displayIcon || null)
                    );
                }

                await interaction.editReply({
                    embeds: bundleEmbeds,
                });
            }
            else if (_subcommand === "nightmarket") {
                const storefront = await webClient.Store.getStorefront(subject);

                if (storefront.data.BonusStore) {
                    const isHidden = interaction.options.getBoolean("hidden") || true;

                    isHidden;

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Work-In-Progress")
                                .setColor(Colors.DarkBlue)
                        ]
                    });
                } else {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Night Market Not Found")
                                .setColor(Colors.Red)
                        ]
                    });
                }
            }
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
                ephemeral: true
            });
        }
    }
);
