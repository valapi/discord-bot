import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomMenu } from '../../interface/SelectMeus';

import type { CustomSlashCommands, CustomSlashCommandsCategory } from '../../interface/SlashCommand';

export default {
    customId: 'helplist',
    async execute({ interaction, command }) {
        //script
        const _CommandType: string = interaction.values[0] as CustomSlashCommandsCategory;

        const createEmbed = new MessageEmbed()
            .setTitle(`Help - ${_CommandType}`)
            .setColor('#0099ff')

        //slash command
        let sendMessage: string = ``;

        for (let cmd of command.array) {
            const _cmd = command.collection.get(cmd.name) as CustomSlashCommands;

            if (_cmd.inDevlopment === true) {
                continue;
            }

            if (_cmd.type != (_CommandType.toLocaleLowerCase())) {
                continue;
            }

            if (!_cmd.echo || !_cmd.echo?.from) {
                sendMessage += `${Formatters.inlineCode('/' + _cmd.data.name)} - ${_cmd.data.description}\n`;
            }
        }

        createEmbed.setDescription(sendMessage);

        // help list
        const createComponents = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('helplist')
                    .setPlaceholder('Select Command Type')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        {
                            label: 'Settings',
                            description: 'Change Settings',
                            value: 'settings',
                        },
                        {
                            label: 'Infomation',
                            description: 'Show Infomations',
                            value: 'infomation',
                        },
                        {
                            label: 'Valorant',
                            description: 'Valorant InGame Info',
                            value: 'valorant',
                        },
                        {
                            label: 'Miscellaneous',
                            description: 'Other Commands',
                            value: 'miscellaneous',
                        },
                    ),
            );

        //sendMessage
        await interaction.editReply({
            embeds: [createEmbed],
            components: [createComponents],
        });
    }
} as CustomMenu