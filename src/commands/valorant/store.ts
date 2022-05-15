//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed } from 'discord.js';
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
        .setDescription('Get Valorant Store'),
    permissions: [
        Permissions.ALL,
    ],
    privateMessage: false,
    async execute({ interaction, language, apiKey }) {
        //script
        const userId = interaction.user.id;

        const ValApiCom = new ValAPI();
        const ValDatabase = (await ValData.verify()).getCollection<IValorantAccount>();
        const ValAccountInDatabase = await ValData.checkIfExist<IValorantAccount>(ValDatabase, { discordId: userId });

        //valorant
        const ValClient = new ApiWrapper({
            region: "ap",
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: language.data.error,
            });

            return;
        }))

        //get
        if (!ValAccountInDatabase.isFind) {
            await interaction.editReply({
                content: language.data.command['account']['not_account'],
            });
            return;
        }

        const SaveAccount = (ValAccountInDatabase.once as IValorantAccount).account;

        ValClient.fromJSONAuth(JSON.parse(decrypt(SaveAccount, apiKey)));

        //success
        const ValorantUserInfo = await ValClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;

        const ValorantStore = await ValClient.Store.GetStorefront(puuid);

        const _time = ToMilliseconds(ValorantStore.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds * 1000);

        //items
        const AllOffers = ValorantStore.data.SkinsPanelLayout.SingleItemOffers as Array<string>;
        let sendMessageArray: Array<MessageEmbed> = [];

        for (const ofItemsId in AllOffers) {
            const ItemsId = AllOffers[ofItemsId];

            //skin
            let Store_ItemID:string = '';
            let Store_Quantity:string = '';
            let Store_ID:string = '';
            let Store_Cost:string = '';
            let Store_Curency:string = 'VP';
            

            const getCurency = await ValApiCom.Currencies.get();
            const getOffers = await ValClient.Store.GetOffers();

            for (const TheOffer of getOffers.data.Offers) {
                for(const _offer of TheOffer.Rewards) {
                    Store_ItemID = _offer.ItemID;
                    Store_Quantity = _offer.Quantity;

                    if(Store_ItemID === ItemsId){
                        Store_ID = TheOffer.OfferID;

                        if(!getCurency.isError && getCurency.data.data){
                            for(const _currency of getCurency.data.data) {
                                Store_Cost = TheOffer.Cost[_currency.uuid];
                                Store_Curency = _currency.displayName;

                                if(Store_Cost){
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                
                if(Store_ID && Store_Cost){
                    break;
                }
            }

            //content tier
            let Store_ContentTier_ID:string = '';

            const GetWeaponSkin = await ValApiCom.Weapons.getSkins();
            if (!GetWeaponSkin.isError && GetWeaponSkin.data.data) {
                for (const _Skins of GetWeaponSkin.data.data) {
                    for (const _Level of _Skins.levels) {
                        if (_Level.uuid === ItemsId) {
                            Store_ContentTier_ID = _Skins.contentTierUuid;
                            break;
                        }
                    }

                    if(Store_ContentTier_ID){
                        break;
                    }
                }
            }

            let Store_ContentTier_Name:string = '';
            let Store_ContentTier_Display:string = '';

            const GetContentTier = await ValApiCom.ContentTiers.getByUuid(String(Store_ContentTier_ID));
            Store_ContentTier_Name = String(GetContentTier.data.data?.devName);
            Store_ContentTier_Display = String(GetContentTier.data.data?.displayIcon);

            //sendMessage
            let ContentTiersColor = String(GetContentTier.data.data?.highlightColor);
            const _Color = ContentTiersColor.substring(0, ContentTiersColor.length - 2);

            const GetWeaponSkinLevel = await ValApiCom.Weapons.getSkinLevels();
            if (!GetWeaponSkinLevel.isError && GetWeaponSkinLevel.data.data) {
                for (const _SkinLevel of GetWeaponSkinLevel.data.data) {
                    if (_SkinLevel.uuid === ItemsId) {
                        let sendMessage = ``;
                        sendMessage += `Price: **${Store_Cost} ${Store_Curency}**\n`;
                        sendMessage += `Slot: **${Number(ofItemsId) + 1}**\n`;

                        const createEmbed = new MessageEmbed()
                            .setColor(`#${_Color}`)
                            .setTitle(_SkinLevel.displayName)
                            .setDescription(sendMessage)
                            .setThumbnail(_SkinLevel.displayIcon)
                            .setAuthor({ name: Store_ContentTier_Name, iconURL: Store_ContentTier_Display })

                        sendMessageArray.push(createEmbed);
                        break;
                    }
                }
            }
        }

        //sendMessage
        await interaction.editReply({
            content: `Time Left: **${_time.all.hour} hour(s) ${_time.all.minute} minute(s) ${_time.all.second} second(s)**`,
            embeds: sendMessageArray,
        });
    }
} as CustomSlashCommands;