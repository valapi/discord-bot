import { Logs } from '@ing3kth/core';

import * as dotenv from 'dotenv';
import * as process from 'process';

import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu, Client as DisClient } from 'discord.js';

import { decrypt, genarateApiKey } from '../utils/crypto';
import { ToMilliseconds } from '@ing3kth/core/dist/utils/Milliseconds';

//valorant
import {
	ValData,
	type IValorantAccount,
	SaveSchema as ValSaveSchema, type IValorantSave, ValorantSchema,
} from '../utils/database';

import ValAccount from './ValAccount';

export default async function dailyStoreTrigger(DiscordClient: DisClient) {
	dotenv.config({
		path: process.cwd() + '/.env'
	});

	/**
	 * Get Account
	 */

	//token
	const ValDatabaseDaily = await ValData.checkCollection<IValorantSave>({
		name: 'daily',
		schema: ValSaveSchema,
	});

	for (let _token of ValDatabaseDaily.data) {
		try {

			//valorant
			const { ValApiCom, ValClient } = await ValAccount({
				apiKey: genarateApiKey(_token.user, _token.guild, process.env['PUBLIC_KEY']),
				userId: _token.userId,
			});

			ValClient.on('error', (async (data) => {
				throw new Error('ValClient Error');
			}));

			//settings
			if (!ValDatabaseDaily.isFind) {
				await ValDatabaseDaily.model.deleteMany({ discordId: _token.userId });
				continue;
			}

			await ValClient.refresh(true);

			/**
			 * Get Offers
			 */
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

			/**
			 * Get Daily Store
			 */

			const ValorantUserInfo = await ValClient.Player.GetUserInfo();
			const puuid = ValorantUserInfo.data.sub;

			const ValorantStore = await ValClient.Store.GetStorefront(puuid);

			//store
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

			/**
			 * Sent Message
			 */
			const _channel = DiscordClient.channels.cache.get(_token.channelId);

			if (_channel?.isText() || _channel?.isThread()) {
				await _channel.send({
					content: `This is the store of ${Formatters.userMention(_token.userId)} today in Valorant\n\nTime Left: **${_time.all.hour} hour(s) ${_time.data.minute} minute(s) ${_time.data.second} second(s)**`,
					embeds: sendMessageArray,
				});
				Logs.log(`<${_token.userId}> sented today store in Valorant`, 'info');
			} else {
				await ValDatabaseDaily.model.deleteMany({ userId: _token.userId });
			}

		} catch (error) {
			Logs.log(`<${_token.userId}> failed to send today store in Valorant`, 'error');
			continue;
		}
	}
};