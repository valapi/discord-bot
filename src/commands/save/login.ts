import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type Client as DisClient, type CommandInteraction,
    MessageAttachment, MessageEmbed
} from 'discord.js';

import * as IngCore from '@ing3kth/core';
import genarateApiKey from '../../utils/genarateApiKey';
import makeBuur from '../../utils/makeBuur';

import { Client as ApiWrapper } from '@valapi/api-wrapper';
import { Client as ValAPI } from '@valapi/valorant-api.com';

export default {
    data: new SlashCommandBuilder()
        .setName('login')
        .setDescription('Manage Valorant Account')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add Your Valorant Account To Database")
                .addStringOption(option =>
                    option
                        .setName('username')
                        .setDescription('Type Your Riot Account Username')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('password')
                        .setDescription('Type Your Riot Account Password')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mfa')
                .setDescription("Get Your Valorant Account From Database")
                .addNumberOption(option =>
                    option
                        .setName('code')
                        .setDescription('Type Your Verify Code')
                        .setRequired(true)
                )
        ),
    async execute(interaction: CommandInteraction, DiscordClient: DisClient, createdTime: Date): Promise<void> {
        //script
        const _subCommand = interaction.options.getSubcommand();
        const _userId = interaction.user.id;
        const _guildId = interaction.guildId

        const _cache = await new IngCore.Cache('valorant');
        const _apiKey = genarateApiKey(_userId, interaction.user.createdTimestamp, _guildId);

        //valorant
        const ValClient = new ApiWrapper({
            region: "ap",
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
            });

            return;
        }))

        //success
        async function success(ValClient: ApiWrapper) {
            const ValorantUserInfo = await ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;

            const ValorantInventory = await ValClient.Player.Loadout(puuid);
            const ValorantPlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
            const ValorantPlayerCard = await (new ValAPI()).PlayerCards.getByUuid(ValorantPlayerCard_ID);
            const ValorantPlayerCard_Display = String(ValorantPlayerCard.data.data?.displayIcon);

            //sendMessage
            let sendMessage = "";
            sendMessage += `Name: **${ValorantUserInfo.data.acct.game_name}**\n`;
            sendMessage += `Tag: **${ValorantUserInfo.data.acct.tag_line}**\n`;
            sendMessage += `ID: **${makeBuur(puuid)}**\n`;

            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`${ValorantUserInfo.data.acct.game_name}`)
                .setAuthor({ name: `${DiscordClient.user?.tag}`, iconURL: DiscordClient.user?.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                .setDescription(sendMessage)
                .setThumbnail(ValorantPlayerCard_Display)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            await interaction.editReply({
                content: `You Are Register Riot Account With`,
                embeds: [ createEmbed ],
            });

            //save
            await _cache.input(ValClient.toJSONAuth(), _userId);
        }

        //sub command
        if (_subCommand === 'add') {
            //auth
            const _USERNAME = String(interaction.options.getString('username'));
            const _PASSWORD = String(interaction.options.getString('password'));

            await ValClient.login(_USERNAME, _PASSWORD);

            //embed
            const createEmbed = new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`/${interaction.commandName} ${_subCommand}`)
                .setDescription(`Username: **${_USERNAME}**\nPassword: **${makeBuur(_PASSWORD)}**`)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            if (!ValClient.multifactor) {
                //success
                await success(ValClient);
            } else {
                //multifactor
                await _cache.input(ValClient.toJSONAuth(), _userId);

                await interaction.editReply({
                    content: `Please Verify Your Account\nBy Using: **/login mfa {VerifyCode}**`,
                    embeds: [
                        createEmbed,
                    ],
                });
            }
        } else if (_subCommand === 'mfa') {
            //auth
            const _MFA_CODE = Number(interaction.options.getNumber("code"));

            let _save = await _cache.output(_userId);

            ValClient.fromJSONAuth(_save);
            await ValClient.verify(_MFA_CODE);

            //success
            await success(ValClient);
        }
    }
};