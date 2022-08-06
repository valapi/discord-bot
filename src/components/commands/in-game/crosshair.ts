//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder, Embed } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { Crosshair } from 'valorant.ts';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('crosshair')
            .setDescription('About My Crosshair')
            .addStringOption(option =>
                option
                    .setName('code')
                    .setDescription('Crosshair Code')
                    .setRequired(true)
            )
    ),
    category: 'valorant',
    async execute({ interaction, DiscordBot }) {
        //load

        const MyCrosshair = new Crosshair(interaction.options.getString('code', true));

        //script

        const sendMessageArray: Array<EmbedBuilder> = [];

        // Primary
        if (MyCrosshair.Primary !== Crosshair.Default.Primary) {
            sendMessageArray.push(
                new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Primary")
                    .addFields(
                        {
                            name: "Crosshair",
                            value: `Color: ${Crosshair.Color[MyCrosshair.Primary.Crosshair.CrosshairColor as keyof typeof Crosshair.Color]}\n\nCenter Dot Opacity: ${MyCrosshair.Primary.Crosshair.CenterDot.Opacity}\nCenter Dot Thickness: ${MyCrosshair.Primary.Crosshair.CenterDot.Thickness}\n\nOutLine Opacity: ${MyCrosshair.Primary.Crosshair.OutLine.Opacity}\nOutLine Thickness: ${MyCrosshair.Primary.Crosshair.OutLine.Thickness}`,
                            inline: true
                        },
                        {
                            name: "Inner Lines",
                            value: `Length: ${MyCrosshair.Primary.InnerLines.Length}\nOpacity: ${MyCrosshair.Primary.InnerLines.Opacity}\nOffset: ${MyCrosshair.Primary.InnerLines.Offset}\nThickness: ${MyCrosshair.Primary.InnerLines.Thickness}\n\nFiring Error: ${MyCrosshair.Primary.InnerLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.Primary.InnerLines.MovementError.Multiplier}`,
                            inline: true
                        },
                        {
                            name: "Outer Lines",
                            value: `Length: ${MyCrosshair.Primary.OuterLines.Length}\nOpacity: ${MyCrosshair.Primary.OuterLines.Opacity}\nOffset: ${MyCrosshair.Primary.OuterLines.Offset}\nThickness: ${MyCrosshair.Primary.OuterLines.Thickness}\n\nFiring Error: ${MyCrosshair.Primary.OuterLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.Primary.OuterLines.MovementError.Multiplier}`,
                            inline: true
                        }
                    )
            );
        }

        // AimDownSights
        if (MyCrosshair.AimDownSights !== Crosshair.Default.AimDownSights) {
            sendMessageArray.push(
                new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Aim Down Sights")
                    .addFields(
                        {
                            name: "Crosshair",
                            value: `Color: ${Crosshair.Color[MyCrosshair.AimDownSights.Crosshair.CrosshairColor as keyof typeof Crosshair.Color]}\n\nCenter Dot Opacity: ${MyCrosshair.AimDownSights.Crosshair.CenterDot.Opacity}\nCenter Dot Thickness: ${MyCrosshair.AimDownSights.Crosshair.CenterDot.Thickness}\n\nOutLine Opacity: ${MyCrosshair.AimDownSights.Crosshair.OutLine.Opacity}\nOutLine Thickness: ${MyCrosshair.AimDownSights.Crosshair.OutLine.Thickness}`,
                            inline: true
                        },
                        {
                            name: "Inner Lines",
                            value: `Length: ${MyCrosshair.AimDownSights.InnerLines.Length}\nOpacity: ${MyCrosshair.AimDownSights.InnerLines.Opacity}\nOffset: ${MyCrosshair.AimDownSights.InnerLines.Offset}\nThickness: ${MyCrosshair.AimDownSights.InnerLines.Thickness}\n\nFiring Error: ${MyCrosshair.AimDownSights.InnerLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.AimDownSights.InnerLines.MovementError.Multiplier}`,
                            inline: true
                        },
                        {
                            name: "Outer Lines",
                            value: `Length: ${MyCrosshair.AimDownSights.OuterLines.Length}\nOpacity: ${MyCrosshair.AimDownSights.OuterLines.Opacity}\nOffset: ${MyCrosshair.AimDownSights.OuterLines.Offset}\nThickness: ${MyCrosshair.AimDownSights.OuterLines.Thickness}\n\nFiring Error: ${MyCrosshair.AimDownSights.OuterLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.AimDownSights.OuterLines.MovementError.Multiplier}`,
                            inline: true
                        }
                    )
            );
        }

        // SniperScope
        if (MyCrosshair.SniperScope !== Crosshair.Default.SniperScope) {
            sendMessageArray.push(
                new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Sniper Scope")
                    .setDescription(`Color: ${Crosshair.Color[MyCrosshair.SniperScope.CenterDot.Color as keyof typeof Crosshair.Color]}\nOpacity: ${MyCrosshair.SniperScope.CenterDot.Opacity}\nThickness: ${MyCrosshair.SniperScope.CenterDot.Thickness}`)
            );
        }

        //return

        if (sendMessageArray === []) {
            return {
                content: "Empty Crosshair",
            };
        }

        return {
            embeds: sendMessageArray,
        };
    },
};

//export

export default __command;