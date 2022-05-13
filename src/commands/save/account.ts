import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type Client as DisClient, type CommandInteraction, Permissions,
    MessageAttachment, MessageEmbed,
} from 'discord.js';

import * as IngCore from '@ing3kth/core';
import { decrypt, encrypt, genarateApiKey } from '../../utils/crypto';
import makeBuur from '../../utils/makeBuur';
import { ValData, type IValorantAccount } from '../../utils/database';

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
    permissions: [
        Permissions.ALL,
    ],
    privateMessage: true,
    async execute(interaction: CommandInteraction, DiscordClient: DisClient, createdTime: Date): Promise<void> {
        //script
        const _subCommand = interaction.options.getSubcommand();
        const _userId = interaction.user.id;
        const _guildId = interaction.guildId

        const ValDatabase = (await ValData.verify()).getCollection<IValorantAccount>();
        const isAccountInDatabase = await ValData.checkIfExist<IValorantAccount>(ValDatabase, { discordId: _userId });

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

            //clear
            _cache.clear(_userId);

            //save
            if(_subCommand === 'get'){
                return;
            }

            if(isAccountInDatabase){
                await ValDatabase.deleteMany({ discordId: _userId });
            }

            const SaveAccount = new ValDatabase({
                account: encrypt(JSON.stringify(ValClient.toJSONAuth()), _apiKey),
                discordId: _userId,
                update: createdTime,
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
                .setDescription(`Username: **${_USERNAME}**\nPassword: **${makeBuur(_PASSWORD)}**`)
                .setTimestamp(createdTime)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

            if (!ValClient.multifactor) {
                //success
                await success(ValClient);
            } else {
                //multifactor
                await _cache.input(encrypt(JSON.stringify(ValClient.toJSONAuth()), _apiKey), _userId);

                await interaction.editReply({
                    content: `Please Verify Your Account\nBy Using: **/login verify {VerifyCode}**`,
                    embeds: [
                        createEmbed,
                    ],
                });
            }
        } else if (_subCommand === 'verify') {
            //auth
            const _MFA_CODE = Number(interaction.options.getNumber("verify_code"));

            const _save = await _cache.output(_userId);

            ValClient.fromJSONAuth(JSON.parse(decrypt(_save, _apiKey)));
            await ValClient.verify(_MFA_CODE);

            //success
            await success(ValClient);
        } else if (_subCommand === 'remove') {
            //from cache
            await _cache.clear(_userId);

            //from database
            if(!isAccountInDatabase) {
                await interaction.editReply({
                    content: `Couldn't Find Your Account`,
                });
                return;
            }

            await ValDatabase.deleteOne({ discordId: _userId });

            //response
            await interaction.editReply({
                content: `Your Account Has Been Removed`,
            });
        } else if (_subCommand === 'get') {
            if(!isAccountInDatabase) {
                await interaction.editReply({
                    content: `Couldn't Find Your Account`,
                });
                return;
            }

            const _save = await ValDatabase.findOne({ discordId: _userId });
            const SaveAccount = (_save.toJSON() as IValorantAccount).account;

            ValClient.fromJSONAuth(JSON.parse(decrypt(SaveAccount, _apiKey)));

            await success(ValClient);
        }
    }
};