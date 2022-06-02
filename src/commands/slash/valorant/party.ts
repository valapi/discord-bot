//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant common
import { decrypt } from '../../../utils/crypto';
import { ValData, type IValorantAccount } from '../../../utils/database';

//valorant
import { Client as ApiWrapper } from '@valapi/api-wrapper';
import { Client as ValAPI } from '@valapi/valorant-api.com';
import { Locale, QueueId } from '@valapi/lib';

export default {
    data: new SlashCommandBuilder()
        .setName('party')
        .setDescription('Valorant InGame Party'),   
    type: 'valorant',
    async execute({ interaction, language, apiKey, createdTime }) {
        //script
        const userId = interaction.user.id;

        const ValDatabase = (await ValData.verify()).getCollection<IValorantAccount>();
        const ValAccountInDatabase = await ValData.checkIfExist<IValorantAccount>(ValDatabase, { discordId: userId });

        //valorant
        const ValApiCom = new ValAPI({
            language: (language.name).replace('_', '-') as keyof typeof Locale.from,
        });
        
        const ValClient = new ApiWrapper({
            region: "ap",
            autoReconnect: true,
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error} ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        //get
        if (!ValAccountInDatabase.isFind) {
            await interaction.editReply({
                content: language.data.command['account']['not_account'],
            });
            return;
        }

        const SaveAccount = (ValAccountInDatabase.once as IValorantAccount).account;

        ValClient.fromJSONAuth(JSON.parse(decrypt(SaveAccount, apiKey)));

        //success
        const ValorantUserInfo = await ValClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;

        let Party_ID:string = (await ValClient.Party.FetchPlayer(puuid)).data.CurrentPartyID;
        const TheParty = await ValClient.Party.FetchParty(Party_ID);

        let sendMessageArray:Array<MessageEmbed> = [];
        let currentArrayPosition:number = 0;

        // PARTY //

        let Party_QueueID:string = QueueId.toString(TheParty.data.MatchmakingData.QueueID as keyof typeof QueueId.to) as string;
        let Party_RemoveRR:string = TheParty.data.MatchmakingData.SkillDisparityRRPenalty;
        let Party_Accessibility:string = TheParty.data.Accessibility;
        
        sendMessageArray.push(
            new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`Party`)
                .addFields(
                    { name: 'Queue Mode', value: Party_QueueID, inline: true },
                    { name: 'Accessibility', value: Party_Accessibility, inline: true },
                ),
        );

        if(Party_RemoveRR){
            sendMessageArray.at(currentArrayPosition)?.addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Disparity Rank Rating Penalty',
                    value: `${Party_RemoveRR}%`,
                    inline: true,
                }
            );
        }

        currentArrayPosition += 1;

        // MEMBER //

        const AllMembers:Array<any> = TheParty.data.Members;
        
        sendMessageArray.push(
            new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`Members`),
        )

        for (let member of AllMembers){
            const ThatPlayer = await ValClient.Player.GetUsername(member.PlayerIdentity.Subject);
            const ThatPlayerArg = (ThatPlayer.data as Array<{ Subject:string, GameName:string, TagLine:string,}>).find(player => player.Subject = member.Subject);

            let sendMessage = `Level: **${member.PlayerIdentity.AccountLevel}**\nWin: **${member.SeasonalBadgeInfo.NumberOfWins}**`
            if(member.IsOwner){
                sendMessage = `*Owner*\n${sendMessage}`
            } else if (member.IsModerator){
                sendMessage = `*Moderator*\n${sendMessage}`
            }

            sendMessageArray.at(currentArrayPosition)?.addField(
                `${ThatPlayerArg?.GameName}#${ThatPlayerArg?.TagLine}`,
                `${sendMessage}`,
                true,
            );
        }

        if(AllMembers.length > 1){
            sendMessageArray.at(currentArrayPosition)?.setColor('#00ff00');
        }

        currentArrayPosition += 1;

        // DONE //

        await interaction.editReply({
            embeds: sendMessageArray,
        });
        
    }
} as CustomSlashCommands;