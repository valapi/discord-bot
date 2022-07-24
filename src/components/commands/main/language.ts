//import

import * as IngCore from '@ing3kth/core';
import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { getLanguage, ILanguage } from '../../../lang';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
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
                        { name: 'English', value: 'en-US' },
                        { name: 'Thai (ไทย)', value: 'th-TH' },
                    )
            )
    ),
    category: 'settings',
    permissions: [
        PermissionsBitField.StageModerator,
        PermissionsBitField.Flags.Administrator,
    ],
    echo: {
        data: [
            'setlanguage',
        ],
    },
    onlyGuild: true,
    async execute({ interaction }) {
        //load

        const _choice = interaction.options.getString('language') as ILanguage.Name;
        const guildId = String(interaction.guild?.id);

        const _cache = new IngCore.Cache('languages');

        //script

        const _old_language = getLanguage(await _cache.output(guildId));
        const _language = getLanguage(_choice);

        if (!_language) {
            if (!_old_language) {
                return {
                    content: `Language **${_choice}** is not found!`,
                };
            } else {
                return {
                    content: _old_language.data.command['language']['fail'],
                };
            }
        } else {
            if (_language.name !== ILanguage.DefaultLanguage) {
                _cache.input(String(_language.name), guildId);
            } else {
                _cache.clear(guildId);
            }

            return {
                content: _language.data.command['language']['succes'],
            };
        }
    },
}

//export

export default __command;