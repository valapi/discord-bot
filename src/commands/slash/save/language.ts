import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';
import { PermissionFlagsBits } from 'discord-api-types/v10';

import * as IngCore from '@ing3kth/core';

import { getLanguage, defaultLanguage } from '../../../language/controller';

export default {
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('Change Language')
        .addStringOption(option =>
            option
                .setName('language')
                .setDescription('Language')
                .setRequired(true)
                .addChoices(
                    //name is displayName
                    //value is data of choice (can get from { .options.getString(); } function)
                    { name: 'English', value: 'en_US' },
                    { name: 'Thai', value: 'th_TH' },
                )
        ),
    type: 'settings',
    permissions: [
        Permissions.STAGE_MODERATOR,
        Permissions.FLAGS.ADMINISTRATOR,
    ],
    echo: {
        command: [
            'setlanguage',
        ]
    },
    onlyGuild: true,
    async execute({ interaction }) {
        const _choice = interaction.options.getString('language') as string;
        const guildId = String(interaction.guild?.id);

        const _cache = new IngCore.Cache('language');

        const _old_language = getLanguage(await _cache.output(guildId));
        const _language = getLanguage(_choice);

        if (!_language) {
            if (!_old_language) {
                await interaction.editReply(`Language **${_choice}** is not found!`);
            } else {
                await interaction.editReply(_old_language.data.command['language']['fail']);
            }
        } else {
            if (_language.name !== defaultLanguage) {
                _cache.input(String(_language.name), guildId);
            } else {
                _cache.clear(guildId);
            }

            await interaction.editReply(_language.data.command['language']['succes']);
        }
    },
} as CustomSlashCommands;