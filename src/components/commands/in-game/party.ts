//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { Region } from 'valorant.ts';
import { ValorAccount } from '../../../utils/accounts';

import { QueueId } from '@valapi/lib';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('party')
            .setDescription('Party')
    ),
    category: 'valorant',
    onlyGuild: true,
    inDevlopment: true, //<--- command are bugg :(
    async execute({ interaction, language, apiKey, createdTime }) {
        //load

        const userId = interaction.user.id;

        const { WebClient, isValorAccountFind } = await ValorAccount({
            userId,
            apiKey,
            language: language.name,
        });

        if (isValorAccountFind === false) {
            return {
                content: language.data.command['account']['not_account'],
            };
        }

        //script

        const puuid = WebClient.getSubject();

        const Party_ID: string = (await WebClient.Party.FetchPlayer(puuid)).data.CurrentPartyID;
        const TheParty = await WebClient.Party.FetchParty(Party_ID);

        const sendMessageArray: Array<EmbedBuilder> = [];

        // PARTY //

        if (TheParty.data.message === 'Party does not exist' || TheParty.data.errorCode === 'PARTY_DNE') {
            return {
                content: language.data.command['party']['not_party'],
            };
        }

        const Party_QueueID: string = QueueId.fromString(TheParty.data.MatchmakingData.QueueID as keyof typeof QueueId.from);
        const Party_RemoveRR: number = TheParty.data.MatchmakingData.SkillDisparityRRPenalty;
        const Party_Accessibility: string = TheParty.data.Accessibility;

        sendMessageArray.push(
            new EmbedBuilder()
                .setColor(`#0099ff`)
                .setTitle(`Party`)
                .addFields(
                    { name: 'Queue Mode', value: `${Party_QueueID}`, inline: true },
                    { name: 'Accessibility', value: `${Party_Accessibility}`, inline: true },
                )
        );

        if (Party_RemoveRR) {
            sendMessageArray.at(0)?.addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Disparity Rank Rating Penalty',
                    value: `${Party_RemoveRR}%`,
                    inline: true,
                }
            );
        }

        // MEMBER //

        const AllMembers: Array<any> = TheParty.data.Members;

        sendMessageArray.push(
            new EmbedBuilder()
                .setColor(`#0099ff`)
                .setTitle(`Members`)
        );

        for (const member of AllMembers) {
            const ThatPlayer = await WebClient.Player.GetUsername(member.PlayerIdentity.Subject);
            const ThatPlayerArg = (ThatPlayer.data as Array<{ Subject: string, GameName: string, TagLine: string, }>).find(player => player.Subject = member.Subject);

            let sendMessage = `Level: **${member.PlayerIdentity.AccountLevel}**`;
            if (member.IsOwner === true) {
                sendMessage = `*Owner*\n${sendMessage}`;
            } else if (member.IsModerator === true) {
                sendMessage = `*Moderator*\n${sendMessage}`;
            }

            sendMessageArray.at(1)?.addFields(
                {
                    name: `${ThatPlayerArg?.GameName}#${ThatPlayerArg?.TagLine}`,
                    value: `${sendMessage}`,
                    inline: true,
                }
            );
        }

        if (AllMembers.length > 1) {
            sendMessageArray.at(1)?.setColor('#00ff00');
        }

        //return

        return {
            embeds: sendMessageArray,
        };
    }
};

//export

export default __command;