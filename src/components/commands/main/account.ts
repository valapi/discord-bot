//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { encrypt, decrypt } from '../../../utils/crypto';
import { ValorDatabase, ValorInterface } from '../../../utils/database';

import { Region } from 'valorant.ts';
import { Region as _Region } from '@valapi/lib';
import { Client as ValWebClient } from '@valapi/web-client';
import { Client as ValApiCom } from '@valapi/valorant-api.com';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('account')
            .setDescription('Manage Valorant Account')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('add')
                    .setDescription("Add Your Valorant Account")
                    .addStringOption(option =>
                        option
                            .setName('username')
                            .setDescription('Riot Account Username')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option
                            .setName('password')
                            .setDescription('Riot Account Password')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('multifactor')
                    .setDescription('Multi-Factor Authentication')
                    .addNumberOption(option =>
                        option
                            .setName('verify_code')
                            .setDescription('Verify Code')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('reconnect')
                    .setDescription('Reconnect Your Account')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('remove')
                    .setDescription("Remove Your Valorant Account")
            )
            .addSubcommand(subCommand =>
                subCommand
                    .setName('settings')
                    .setDescription('Account Settings')
                    .addStringOption(option =>
                        option
                            .setName('region')
                            .setDescription('Change Your Account Region')
                            .addChoices(
                                { name: _Region.from.ap, value: _Region.to.Asia_Pacific },
                                { name: _Region.from.br, value: _Region.to.Brazil },
                                { name: _Region.from.eu, value: _Region.to.Europe },
                                { name: _Region.from.kr, value: _Region.to.Korea },
                                { name: _Region.from.latam, value: _Region.to.Latin_America },
                                { name: _Region.from.na, value: _Region.to.North_America },
                                { name: _Region.from.pbe, value: _Region.to.Public_Beta_Environment },
                            )
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('get')
                    .setDescription("Get Your Valorant Account")
            )
    ),
    category: 'settings',
    onlyGuild: true,
    isPrivateMessage: true,
    echo: {
        data: [
            { oldName: 'add', newName: 'login' },
            { oldName: 'multifactor', newName: 'verify' },
            { oldName: 'remove', newName: 'logout' },
        ],
    },
    async execute({ interaction, apiKey, createdTime, language }) {
        //load

        const userId = interaction.user.id;
        const thisSubCommand = interaction.options.getSubcommand();

        const CommandLanguage = language.data.command.account;

        const _cache = new IngCore.Cache('authentications');

        const ValAccount = await ValorDatabase<ValorInterface.Account.Format>({
            name: 'account',
            schema: ValorInterface.Account.Schema,
            filter: { discordId: userId },
            token: process.env['MONGO_TOKEN'],
        });

        //valorant

        const ValorantApiCom = new ValApiCom({
            language: language.name,
        });

        const WebClient = new ValWebClient();

        async function ValorSave(WebClient: ValWebClient) {
            (new IngCore.Cache('accounts')).clear(userId);

            if (ValAccount.isFind === true) {
                await ValAccount.model.deleteMany({ discordId: userId });
            }

            const _ClientData = WebClient.toJSON();

            await (
                new ValAccount.model({
                    account: encrypt(_ClientData.cookie.ssid, apiKey),
                    region: _ClientData.region.live,
                    discordId: userId,
                    createdAt: (ValAccount.data.at(0))?.createdAt || new Date(),
                })
            ).save();
        }

        async function ValorSuccess(WebClient: ValWebClient, isSave: boolean) {
            if (isSave === true) {
                _cache.clear(userId);
                
                await ValorSave(WebClient);
            }

            const ValorantUserInfo = await WebClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;

            const ValorantInventory = await WebClient.Player.Loadout(puuid);
            const ValorantPlayerCard = await ValorantApiCom.PlayerCards.getByUuid(ValorantInventory.data.Identity.PlayerCardID);

            //return
            return {
                content: CommandLanguage['succes'],
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#0099ff`)
                        .addFields(
                            { name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true },
                            { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true },
                            { name: '\u200B', value: '\u200B' },
                            { name: `ID`, value: `${puuid}`, inline: true },
                        )
                        .setThumbnail(String(ValorantPlayerCard.data.data?.displayIcon))
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` })
                ],
            };
        }

        //script

        if (thisSubCommand === 'add') {
            //load

            const _InputUsername = String(interaction.options.getString('username'));

            //script

            await WebClient.login(_InputUsername, String(interaction.options.getString('password')));

            if (WebClient.isMultifactor === false) {
                return await ValorSuccess(WebClient, true);
            }

            _cache.input(encrypt(JSON.stringify(WebClient.toJSON()), apiKey), userId);

            //return

            return {
                content: CommandLanguage['verify'],
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#0099ff`)
                        .setTitle(`/${interaction.commandName} ${thisSubCommand}`)
                        .setDescription(`Username: **${_InputUsername}**`)
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
                ],
            };
        }

        if (thisSubCommand === 'multifactor') {
            //load

            const _save = _cache.output(userId);

            if (!_save) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }

            //script

            WebClient.fromJSON(JSON.parse(decrypt(_save, apiKey)));

            await WebClient.verify(Number(interaction.options.getNumber("verify_code")));

            //return

            return await ValorSuccess(WebClient, true);
        }

        if (thisSubCommand === 'reconnect') {
            //load

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }

            //script

            await WebClient.fromCookie(decrypt((ValAccount.data[0]).account, apiKey));
            WebClient.setRegion((ValAccount.data[0]).region);

            await WebClient.refresh(true);

            await ValorSave(WebClient);

            //return

            return {
                content: CommandLanguage['reconnect'],
            };
        }

        if (thisSubCommand === 'remove') {
            //load

            _cache.clear(userId);

            (new IngCore.Cache('accounts')).clear(userId);

            //script

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }

            await ValAccount.model.deleteMany({ discordId: userId });

            //return

            return {
                content: CommandLanguage['remove'],
            };
        }

        if (thisSubCommand === 'settings') {
            //load

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }

            //script

            await WebClient.fromCookie(decrypt((ValAccount.data[0]).account, apiKey));

            const _choice = interaction.options.getString('region') as keyof typeof _Region.from;

            WebClient.setRegion(_choice);

            await ValorSave(WebClient);

            //return

            return {
                content: `__*beta*__\n\nchanged region to **${String(_Region.fromString(WebClient.toJSON().region.live as keyof typeof _Region.from)).replace('_', ' ')}**\n\n`,
            };
        }

        if (thisSubCommand === 'get') {
            //load

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage['not_account'],
                };
            }

            //script

            await WebClient.fromCookie(decrypt((ValAccount.data[0]).account, apiKey));
            WebClient.setRegion((ValAccount.data[0]).region);

            await WebClient.refresh(false);

            //return

            return await ValorSuccess(WebClient, false);
        }
    },
};

//export

export default __command;