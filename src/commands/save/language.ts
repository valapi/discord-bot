import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed } from 'discord.js';
import type { SlashCommandExtendData } from '../../interface/SlashCommand';

import { getLanguageAndUndefined } from '../../language/controller';
import * as IngCore from '@ing3kth/core';

import { getLanguage } from '../../language/controller';

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
                    { name: 'NotARealOne', value: 'bestvalorantbot' },
                )
        ),
    permissions: [
        Permissions.STAGE_MODERATOR,
        Permissions.FLAGS.ADMINISTRATOR,
    ],
	privateMessage: false,
	async execute({ interaction }:SlashCommandExtendData): Promise<void> {
        const _choice = interaction.options.getString('language') as string;
        const guildId = String(interaction.guild?.id);

        const _cache = await new IngCore.Cache('language');

        const _old_language = getLanguage(await _cache.output(guildId));
        const _language = getLanguage(_choice);

        if (!_language) {
            if(!_old_language) {
                await interaction.editReply(`Language **${_choice}** is not found!`);
            } else {
                await interaction.editReply(_old_language.data.command['language']['fail']);
            }
        } else {
            await _cache.input(String(_language.language), guildId);

            await interaction.editReply(_language.data.command['language']['succes']);
        }
	},
};