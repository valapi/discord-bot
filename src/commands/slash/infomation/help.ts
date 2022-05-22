import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show all Commands'),
    type: 'infomation',
	async execute({ interaction, language, DiscordClient, command }) {
		//script
        const createEmbed = new MessageEmbed()
            .setTitle('Help')
            .addFields(
                {
                    name: 'reportbug',
                    value: 'Report Bug To Developer',
                    inline: true,
                },
                {
                    name: 'account',
                    value: 'Manage Valorant Account',
                    inline: true,
                },
                {
                    name: 'language',
                    value: 'Change Language',
                    inline: true,
                },
            )
            .setColor('#0099ff')
        
        //slash command
        let sendMessage:string = ``;

        command.array.forEach(cmd => {
            const _cmd = command.collection.get(cmd.name) as CustomSlashCommands;

            if(!_cmd.echo || !_cmd.echo.from) {
                switch(_cmd.data.name){
                    case 'report':
                        break;
                    case 'help':
                        break;
                    case 'ping':
                        break;
                    case 'status':
                        break;
                    default:
                        sendMessage += `${Formatters.inlineCode('/' + _cmd.data.name)} - ${_cmd.data.description}\n`;
                        break;
                }
            }
        });

        createEmbed.setDescription(sendMessage);

        await interaction.editReply({
            embeds: [ createEmbed ],
        });
	},
} as CustomSlashCommands;