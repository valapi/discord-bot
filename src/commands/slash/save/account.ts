import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

import * as IngCore from '@ing3kth/core';
import { decrypt, encrypt } from '../../../utils/crypto';
import { ValData, type IValorantAccount, ValorantSchema } from '../../../utils/database';

import { Region as TheValRegion } from '@valapi/lib';
import { Client as ApiWrapper } from '@valapi/web-client';
import { Client as ValAPI } from '@valapi/valorant-api.com';

export default {
    data: new SlashCommandBuilder()
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
                .setName('verify')
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
                            { name: TheValRegion.from.ap, value: TheValRegion.to.Asia_Pacific },
                            { name: TheValRegion.from.br, value: TheValRegion.to.Brazil },
                            { name: TheValRegion.from.eu, value: TheValRegion.to.Europe },
                            { name: TheValRegion.from.kr, value: TheValRegion.to.Korea },
                            { name: TheValRegion.from.latam, value: TheValRegion.to.Latin_America },
                            { name: TheValRegion.from.na, value: TheValRegion.to.North_America },
                            { name: TheValRegion.from.pbe, value: TheValRegion.to.Public_Beta_Environment },
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription("Get Your Valorant Account")
        ),
    type: 'settings',
    privateMessage: true,
    echo: {
        command: [
            {
                newCommandName: 'login',
                subCommandName: 'add',
            },
            {
                newCommandName: 'verify',
                subCommandName: 'verify',
            },
            {
                newCommandName: 'logout',
                subCommandName: 'remove',
            },
        ],
    },
    onlyGuild: true,
    async execute({ interaction, createdTime, language, apiKey }) {
        //script
        const userId = interaction.user.id;
        const _subCommand = interaction.options.getSubcommand();

        const CommandLanguage = language.data.command['account'];

        const ValAccount = await ValData.checkCollection<IValorantAccount>({
            name: 'account',
            schema: ValorantSchema,
            filter: { discordId: userId },
        });

        const _cache = new IngCore.Cache('authentication');

        //valorant
        const ValClient = new ApiWrapper({
            region: "ap",
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error}  ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        //success
        async function save(ValClient: ApiWrapper) {
            if (ValAccount.isFind) {
                await ValAccount.model.deleteMany({ discordId: userId });
            }

            const SaveAccount = new ValAccount.model({
                account: encrypt(ValClient.toJSON().cookie.ssid, apiKey),
                discordId: userId,
                createdAt: createdTime,
            });
            await SaveAccount.save();
        }

        async function success(ValClient: ApiWrapper) {
            const ValorantUserInfo = await ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;

            const ValorantInventory = await ValClient.Player.Loadout(puuid);
            const ValorantPlayerCard = await (new ValAPI()).PlayerCards.getByUuid(ValorantInventory.data.Identity.PlayerCardID);

            //sendMessage
            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .addFields(
                    { name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true },
                    { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: `ID`, value: `${puuid}`, inline: true },
                )
                .setThumbnail(String(ValorantPlayerCard.data.data?.displayIcon))
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            await interaction.editReply({
                content: CommandLanguage['succes'],
                embeds: [createEmbed],
            });

            //cache
            _cache.clear(userId);

            (new IngCore.Cache('accounts')).input(encrypt(JSON.stringify(ValClient.toJSON()), apiKey), userId);

            //save
            if (_subCommand === 'get') {
                return;
            }

            await save(ValClient);
        }

        //sub command
        if (_subCommand === 'add') {
            //auth
            const _USERNAME = String(interaction.options.getString('username'));

            await ValClient.login(_USERNAME, String(interaction.options.getString('password')));

            //embed
            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`/${interaction.commandName} ${_subCommand}`)
                .setDescription(`Username: **${_USERNAME}**`)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            if (!ValClient.isMultifactor) {
                //success
                await success(ValClient);
            } else {
                //multifactor
                _cache.input(encrypt(JSON.stringify(ValClient.toJSON()), apiKey), userId);

                await interaction.editReply({
                    content: CommandLanguage.verify,
                    embeds: [
                        createEmbed,
                    ],
                });
            }
        } else if (_subCommand === 'verify') {
            //auth
            const _save = await _cache.output(userId);
            if (!_save) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            ValClient.fromJSON(JSON.parse(decrypt(_save, apiKey)));
            await ValClient.verify(Number(interaction.options.getNumber("verify_code")));

            //success
            await success(ValClient);
        } else if (_subCommand === 'reconnect') {
            //connect
            if (!ValAccount.isFind) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            const NewValClient = await ApiWrapper.fromCookie(decrypt((ValAccount.data[0] as IValorantAccount).account, apiKey));

            //reconnect
            await NewValClient.refresh(true);

            await interaction.editReply(CommandLanguage['reconnect']);

            //save
            await success(NewValClient);
        } else if (_subCommand === 'remove') {
            //from cache
            _cache.clear(userId);

            (new IngCore.Cache('accounts')).clear(userId);

            //from database
            if (!ValAccount.isFind) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            await ValAccount.model.deleteMany({ discordId: userId });

            //response
            await interaction.editReply({
                content: CommandLanguage['remove'],
            });
        } else if (_subCommand === 'settings') {
            if (!ValAccount.isFind) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            //settings
            const _choice = interaction.options.getString('region') as keyof typeof TheValRegion.to;

            ValClient.setRegion(TheValRegion.toString(_choice));

            await interaction.editReply(`changed region to **${_choice.replace('_', ' ')}**`);

            //save
            await save(ValClient);
        } else if (_subCommand === 'get') {
            if (!ValAccount.isFind) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            const NewValClient = await ApiWrapper.fromCookie(decrypt((ValAccount.data[0] as IValorantAccount).account, apiKey));
            await NewValClient.refresh(false);

            await success(NewValClient);
        }
    }
} as CustomSlashCommands;