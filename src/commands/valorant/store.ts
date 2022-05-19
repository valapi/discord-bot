//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters } from 'discord.js';
import type { CustomSlashCommands } from '../../interface/SlashCommand';

//valorant common
import { decrypt } from '../../utils/crypto';
import { ValData, type IValorantAccount } from '../../utils/database';

//valorant
import { Client as ApiWrapper } from '@valapi/api-wrapper';
import { Client as ValAPI } from '@valapi/valorant-api.com';

//extend
import { ToMilliseconds } from '@ing3kth/core/dist/utils/Milliseconds';

export default {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Get Valorant Store')
        .addSubcommand(subcommand =>
            subcommand
                .setName('daily')
                .setDescription('Daily Store')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bundle')
                .setDescription('Current Bundle')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('night_market')
                .setDescription('Night Market')
        ),
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
    async execute({ interaction, language, apiKey }) {
        //script
        const userId = interaction.user.id;
        const _subCommand = interaction.options.getSubcommand();

        const ValApiCom = new ValAPI();
        const ValDatabase = (await ValData.verify()).getCollection<IValorantAccount>();
        const ValAccountInDatabase = await ValData.checkIfExist<IValorantAccount>(ValDatabase, { discordId: userId });

        //valorant
        const ValClient = new ApiWrapper({
            region: "ap",
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error} ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        //get
        if (!ValAccountInDatabase.isFind) {
            await interaction.editReply({
                content: language.data.command['account']['not_account'],
            });
            return;
        }

        const SaveAccount = (ValAccountInDatabase.once as IValorantAccount).account;

        ValClient.fromJSONAuth(JSON.parse(decrypt(SaveAccount, apiKey)));

        const ValorantUserInfo = await ValClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;

        const ValorantStore = await ValClient.Store.GetStorefront(puuid);

        //function
        const getCurency = await ValApiCom.Currencies.get();
        const getOffers = await ValClient.Store.GetOffers();
        const GetWeaponSkin = await ValApiCom.Weapons.getSkins();

        async function getOffersOf(ItemsId: string) {
            let Store_ItemID: string = '';
            let Store_Quantity: string = '';
            let Store_ID: string = '';
            let Store_Cost: string = '';
            let Store_Curency: string = 'VP';

            // Main //
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

            // Content Tier Id //
            let Store_ContentTier_ID: string = '';

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
            let Store_ContentTier_Name: string = '';
            let Store_ContentTier_Display: string = '';

            const GetContentTier = await ValApiCom.ContentTiers.getByUuid(String(Store_ContentTier_ID));
            Store_ContentTier_Name = String(GetContentTier.data.data?.devName);
            Store_ContentTier_Display = String(GetContentTier.data.data?.displayIcon);

            //color
            let ContentTiersColor = String(GetContentTier.data.data?.highlightColor);
            const _Color = ContentTiersColor.substring(0, ContentTiersColor.length - 2);

            //display

            let Store_Display_Name: string = '';
            let Store_Display_Icon: string = '';
            const GetWeaponSkinLevel = await ValApiCom.Weapons.getSkinLevels();
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
                Curency: Store_Curency,
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
        }

        async function success(time:number, ItemIDs: Array<string>) {
            const _time = ToMilliseconds(time * 1000);
            let sendMessageArray: Array<MessageEmbed> = [];

            for(const ofItemID in ItemIDs) {
                const ItemID = ItemIDs[ofItemID];
                const _Offer = await getOffersOf(ItemID);

                let sendMessage = ``;
                sendMessage += `Price: **${_Offer.Cost} ${_Offer.Curency}**\n`;
                sendMessage += `Slot: **${Number(ofItemID) + 1}**\n`;

                const createEmbed = new MessageEmbed()
                    .setColor(`#${_Offer.ContentTier.Color}`)
                    .setTitle(_Offer.Display.Name)
                    .setDescription(sendMessage)
                    .setThumbnail(_Offer.Display.Icon)
                    .setAuthor({ name: _Offer.ContentTier.Name, iconURL: _Offer.ContentTier.Display })

                sendMessageArray.push(createEmbed);
            }

            //sendMessage
            await interaction.editReply({
                content: `Time Left: **${_time.all.hour} hour(s) ${_time.all.minute} minute(s) ${_time.all.second} second(s)**`,
                embeds: sendMessageArray,
            });
        }

        if (_subCommand === 'daily') {
            const TimeLeft = Number(ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds);
            const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers;

            await success(TimeLeft, AllOffers)
        } else if (_subCommand === 'bundle') {
            //work in progress
            for(const ofTheBundle in ValorantStore.data.FeaturedBundle.Bundles) {
                const TheBundle = ValorantStore.data.FeaturedBundle.Bundles[ofTheBundle];

                const ThisBundleId = TheBundle.DataAssetID;
                const ThisBundleData = ValApiCom.Bundles.getByUuid(ThisBundleId);

                const TimeLeft = Number(TheBundle.DurationRemainingInSeconds);
                const TimeInMillisecondFormat = ToMilliseconds(TimeLeft * 1000);

                const isNeedToBuyWholesaleOnly = Boolean(TheBundle.WholesaleOnly);

                //items
                const AllItems = TheBundle.Items as Array<{
                    Item: {
                        ItemTypeID: string;
                        ItemID: string;
                        Amount: number;
                    };
                    BasePrice: number;
                    CurrencyID: string;
                    DiscountPercent: string;
                    DiscountedPrice: string;
                    IsPromoItem: Boolean;
                }>;

                //to be continue
            }

            ValApiCom.Bundles.getByUuid(ValorantStore.data.FeaturedBundle.Bundle.uuid);
        } else if (_subCommand === 'night_market') {
            if (!ValorantStore.data.BonusStore) {
                await interaction.editReply({
                    content: `Bonus Store is undefined`,
                });
                return;
            } else {
                const TimeLeft = Number(ValorantStore.data.BonusStore.BonusStoreRemainingDurationInSeconds);
                const _BonusStore = ValorantStore.data.BonusStore.BonusStoreOffers;

                let ArrayOfItemID: Array<string> = [];

                for (const ofBonusStore of _BonusStore) {
                    ArrayOfItemID.push(ofBonusStore.Offer.Rewards[0].ItemID);
                }

                await success(TimeLeft, ArrayOfItemID)
            }
        }
    }
} as CustomSlashCommands;