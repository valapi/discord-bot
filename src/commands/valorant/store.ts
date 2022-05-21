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
import { Locale } from '@valapi/lib';

//extend
import { ToMilliseconds } from '@ing3kth/core/dist/utils/Milliseconds';

export default {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Valorant Store')
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
                .addBooleanOption(option =>
                    option
                        .setName('show_hidden')
                        .setDescription('Show All Items')
                )
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
    async execute({ interaction, language, apiKey}) {
        //script
        const userId = interaction.user.id;
        const _subCommand = interaction.options.getSubcommand();

        const ValApiCom = new ValAPI({
            language: (language.name).replace('_', '-') as keyof typeof Locale,
        });
        
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
            let Store_Curency_Name: string = 'VP';
            let Store_Curency_ID: string = '';
            let Store_StartTime: string = '';

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
        }

        if (_subCommand === 'daily') {
            const TimeLeft = Number(ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds);
            const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers;

            const _time = ToMilliseconds(TimeLeft * 1000);
            let sendMessageArray: Array<MessageEmbed> = [];

            for (const ofItemID in AllOffers) {
                const ItemID = AllOffers[ofItemID];
                const _Offer = await getOffersOf(ItemID);

                let sendMessage = ``;
                sendMessage += `Price: **${_Offer.Cost} ${_Offer.Curency.Name}**\n`;
                sendMessage += `Create At: **${_Offer.CreateTime.toUTCString()}**\n`;
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
                content: `Time Left: **${_time.all.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`,
                embeds: sendMessageArray,
            });
        } else if (_subCommand === 'bundle') {
            //work in progress
            let sendMessageArray = [];

            for (const ofTheBundle in ValorantStore.data.FeaturedBundle.Bundles) {
                const TheBundle = ValorantStore.data.FeaturedBundle.Bundles[ofTheBundle];

                const ThisBundleId = TheBundle.DataAssetID;
                const ThisBundleCurrency = TheBundle.CurrencyID;

                const ThisBundleData = await ValApiCom.Bundles.getByUuid(ThisBundleId);
                if(!ThisBundleData.data.data){
                    throw new Error(ThisBundleData.data.error);
                }

                const TimeLeft = Number(TheBundle.DurationRemainingInSeconds);
                const TimeInMillisecondFormat = ToMilliseconds(TimeLeft * 1000);

                const isNeedToBuyWholesaleOnly = Boolean(TheBundle.WholesaleOnly);

                //price
                let Price_Base:number = 0;
                let Price_Discounted:number = 0;
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
                    IsPromoItem: Boolean;
                }>;

                for(let ofItem of AllItems){
                    Price_Base += ofItem.BasePrice;
                    Price_Discounted += ofItem.DiscountedPrice;
                }

                //currency
                const GetCurrency = await ValApiCom.Currencies.getByUuid(ThisBundleCurrency);
                if(GetCurrency.isError || !GetCurrency.data.data){
                    throw new Error(GetCurrency.data.error);
                }

                let ThePrice = GetCurrency.data.data.displayName;

                let Price_DiscountCosts:number = (Price_Base - Price_Discounted) / Price_Base * 100;

                //embed
                const createEmbed = new MessageEmbed()
                    .setImage(ThisBundleData.data.data?.displayIcon as string)
                    .addFields(
                        { name: `Name`, value: `${ThisBundleData.data.data.displayName}`, inline: true },
                        { name: `Price`, value: `~~${Price_Base}~~ *-->* **${Price_Discounted} ${ThePrice} (-${Math.ceil(Price_DiscountCosts)}%)**`, inline: true },
                        { name: '\u200B', value: '\u200B' },
                        { name: `Time Remaining`, value: `${TimeInMillisecondFormat.data.day} day(s) ${TimeInMillisecondFormat.data.hour} hour(s) ${TimeInMillisecondFormat.data.minute} minute(s) ${TimeInMillisecondFormat.data.second} second(s)`, inline: true },
                    )

                sendMessageArray.push(createEmbed);
            }

            await interaction.editReply({
                embeds: sendMessageArray,
            });
        } else if (_subCommand === 'night_market') {
            if (!ValorantStore.data.BonusStore) {
                await interaction.editReply({
                    content: `${language.data.command['store']['not_nightmarket']}`,
                });
                return;
            } else {
                const ForceToShow = interaction.options.getBoolean('show_hidden') || false;
                const TimeLeft = Number(ValorantStore.data.BonusStore.BonusStoreRemainingDurationInSeconds);
                const _time = ToMilliseconds(TimeLeft * 1000);

                const _BonusStore = ValorantStore.data.BonusStore.BonusStoreOffers;

                let sendMessageArray: Array<MessageEmbed> = [];

                for (let ofItem in _BonusStore) {
                    const ThisBonusStore = _BonusStore[ofItem];
                    const ItemId = ThisBonusStore.Offer.Rewards[0].ItemID;

                    //script
                    let DiscountPercent = ThisBonusStore.DiscountPercent;
                    let IsSeen = Boolean(ThisBonusStore.IsSeen);

                    if(!IsSeen && !ForceToShow) continue;

                    const _Offer = await getOffersOf(ItemId);
                    let DiscountCosts = ThisBonusStore.DiscountCosts[_Offer.Curency.Id];

                    let sendMessage = ``;
                    sendMessage += `Price: ~~${_Offer.Cost}~~ *-->* **${DiscountCosts} ${_Offer.Curency.Name} (-${DiscountPercent}%)**\n`;
                    sendMessage += `Create At: **${_Offer.CreateTime.toUTCString()}**\n`;
                    sendMessage += `Slot: **${Number(ofItem) + 1}**\n`;

                    sendMessageArray.push(
                        new MessageEmbed()
                            .setColor(`#${_Offer.ContentTier.Color}`)
                            .setTitle(_Offer.Display.Name)
                            .setDescription(sendMessage)
                            .setThumbnail(_Offer.Display.Icon)
                            .setAuthor({ name: _Offer.ContentTier.Name, iconURL: _Offer.ContentTier.Display })
                    )
                }

                let _message:string = `Time Left: **${_time.data.day} day(s) ${_time.data.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`
                if(sendMessageArray.length === 0){
                    _message += `\n\n` + language.data.command['store']['no_nightmarket'];
                }

                await interaction.editReply({
                    content: _message,
                    embeds: sendMessageArray,
                });
            }
        }
    }
} as CustomSlashCommands;