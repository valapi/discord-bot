import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

import * as IngCore from '@ing3kth/core';
import { decrypt, encrypt } from '../../../utils/crypto';
import makeBuur from '../../../utils/makeBuur';
import { ValData, type IValorantAccount } from '../../../utils/database';

import { Client as ApiWrapper } from '@valapi/api-wrapper';
import { Client as ValAPI } from '@valapi/valorant-api.com';

export default {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Manage Valorant Account')
        .addSubcommand(subcommand =>
            subcommand
                .setName('login')
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
                .setName('remove')
                .setDescription("Remove Your Valorant Account")
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
                subCommandName: 'login',
            },
            {
                newCommandName: 'verify',
                subCommandName: 'verify',
            },
            {
                newCommandName: 'logout',
                subCommandName: 'remove',
            }
        ],
    },
    onlyGuild: true,
    async execute({ interaction, createdTime, language, apiKey }) {
        //script
        const _subCommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        const CommandLanguage = language.data.command['account'];

        const ValDatabase = (await ValData.verify()).getCollection<IValorantAccount>();
        const ValAccountInDatabase = await ValData.checkIfExist<IValorantAccount>(ValDatabase, { discordId: userId });

        const _cache = await new IngCore.Cache('valorant');

        //valorant
        const ValClient = new ApiWrapper({
            region: "ap",
            autoReconnect: true,
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error} ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        //success
        async function success(ValClient: ApiWrapper) {
            if(ValClient.isError){
                return;
            }

            const ValorantUserInfo = await ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;

            const ValorantInventory = await ValClient.Player.Loadout(puuid);
            const ValorantPlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
            const ValorantPlayerCard = await (new ValAPI()).PlayerCards.getByUuid(ValorantPlayerCard_ID);
            const ValorantPlayerCard_Display = String(ValorantPlayerCard.data.data?.displayIcon);

            //sendMessage
            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .addFields(
                    { name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true },
                    { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: `ID`, value: `${puuid}`, inline: true },
                )
                .setThumbnail(ValorantPlayerCard_Display)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            await interaction.editReply({
                content: CommandLanguage['succes'],
                embeds: [ createEmbed ],
            });

            //clear
            _cache.clear(userId);

            //save
            if(_subCommand === 'get'){
                return;
            }

            if(ValAccountInDatabase.isFind){
                await ValDatabase.deleteMany({ discordId: userId });
            }

            const SaveAccount = new ValDatabase({
                account: encrypt(JSON.stringify(ValClient.toJSONAuth()), apiKey),
                discordId: userId,
                createdAt: createdTime,
            });
            await SaveAccount.save();
        }

        //sub command
        if (_subCommand === 'login') {
            //auth
            const _USERNAME = String(interaction.options.getString('username'));
            const _PASSWORD = String(interaction.options.getString('password'));

            await ValClient.login(_USERNAME, _PASSWORD);

            //embed
            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`/${interaction.commandName} ${_subCommand}`)
                .setDescription(`Username: **${_USERNAME}**\nPassword: **${makeBuur({ message: _PASSWORD, percent: 70 })}**`)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            if (!ValClient.multifactor) {
                //success
                await success(ValClient);
            } else {
                //multifactor
                await _cache.input(encrypt(JSON.stringify(ValClient.toJSONAuth()), apiKey), userId);

                await interaction.editReply({
                    content: CommandLanguage.verify,
                    embeds: [
                        createEmbed,
                    ],
                });
            }
        } else if (_subCommand === 'verify') {
            //auth
            const _MFA_CODE = Number(interaction.options.getNumber("verify_code"));

            const _save = await _cache.output(userId);
            if(!_save) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            ValClient.fromJSONAuth(JSON.parse(decrypt(_save, apiKey)));
            await ValClient.verify(_MFA_CODE);

            //success
            await success(ValClient);
        } else if (_subCommand === 'remove') {
            //from cache
            await _cache.clear(userId);

            //from database
            if(!ValAccountInDatabase.isFind) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            await ValDatabase.deleteOne({ discordId: userId });

            //response
            await interaction.editReply({
                content: CommandLanguage['remove'],
            });
        } else if (_subCommand === 'get') {
            if(!ValAccountInDatabase.isFind) {
                await interaction.editReply({
                    content: CommandLanguage['not_account'],
                });
                return;
            }

            const SaveAccount = (ValAccountInDatabase.once as IValorantAccount).account;

            ValClient.fromJSONAuth(JSON.parse(decrypt(SaveAccount, apiKey)));

            await success(ValClient);
        }
    }
} as CustomSlashCommands;