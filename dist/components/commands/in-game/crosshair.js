"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const valorant_ts_1 = require("valorant.ts");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('crosshair')
        .setDescription('About My Crosshair')
        .addStringOption(option => option
        .setName('code')
        .setDescription('Crosshair Code')
        .setRequired(true))),
    category: 'valorant',
    execute({ interaction, DiscordBot }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const MyCrosshair = new valorant_ts_1.Crosshair(interaction.options.getString('code', true));
            const sendMessageArray = [];
            if (MyCrosshair.Primary !== valorant_ts_1.Crosshair.Default.Primary) {
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Primary")
                    .addFields({
                    name: "Crosshair",
                    value: `Color: ${valorant_ts_1.Crosshair.Color[MyCrosshair.Primary.Crosshair.CrosshairColor]}\n\nCenter Dot Opacity: ${MyCrosshair.Primary.Crosshair.CenterDot.Opacity}\nCenter Dot Thickness: ${MyCrosshair.Primary.Crosshair.CenterDot.Thickness}\n\nOutLine Opacity: ${MyCrosshair.Primary.Crosshair.OutLine.Opacity}\nOutLine Thickness: ${MyCrosshair.Primary.Crosshair.OutLine.Thickness}`,
                    inline: true
                }, {
                    name: "Inner Lines",
                    value: `Length: ${MyCrosshair.Primary.InnerLines.Length}\nOpacity: ${MyCrosshair.Primary.InnerLines.Opacity}\nOffset: ${MyCrosshair.Primary.InnerLines.Offset}\nThickness: ${MyCrosshair.Primary.InnerLines.Thickness}\n\nFiring Error: ${MyCrosshair.Primary.InnerLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.Primary.InnerLines.MovementError.Multiplier}`,
                    inline: true
                }, {
                    name: "Outer Lines",
                    value: `Length: ${MyCrosshair.Primary.OuterLines.Length}\nOpacity: ${MyCrosshair.Primary.OuterLines.Opacity}\nOffset: ${MyCrosshair.Primary.OuterLines.Offset}\nThickness: ${MyCrosshair.Primary.OuterLines.Thickness}\n\nFiring Error: ${MyCrosshair.Primary.OuterLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.Primary.OuterLines.MovementError.Multiplier}`,
                    inline: true
                }));
            }
            if (MyCrosshair.AimDownSights !== valorant_ts_1.Crosshair.Default.AimDownSights) {
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Aim Down Sights")
                    .addFields({
                    name: "Crosshair",
                    value: `Color: ${valorant_ts_1.Crosshair.Color[MyCrosshair.AimDownSights.Crosshair.CrosshairColor]}\n\nCenter Dot Opacity: ${MyCrosshair.AimDownSights.Crosshair.CenterDot.Opacity}\nCenter Dot Thickness: ${MyCrosshair.AimDownSights.Crosshair.CenterDot.Thickness}\n\nOutLine Opacity: ${MyCrosshair.AimDownSights.Crosshair.OutLine.Opacity}\nOutLine Thickness: ${MyCrosshair.AimDownSights.Crosshair.OutLine.Thickness}`,
                    inline: true
                }, {
                    name: "Inner Lines",
                    value: `Length: ${MyCrosshair.AimDownSights.InnerLines.Length}\nOpacity: ${MyCrosshair.AimDownSights.InnerLines.Opacity}\nOffset: ${MyCrosshair.AimDownSights.InnerLines.Offset}\nThickness: ${MyCrosshair.AimDownSights.InnerLines.Thickness}\n\nFiring Error: ${MyCrosshair.AimDownSights.InnerLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.AimDownSights.InnerLines.MovementError.Multiplier}`,
                    inline: true
                }, {
                    name: "Outer Lines",
                    value: `Length: ${MyCrosshair.AimDownSights.OuterLines.Length}\nOpacity: ${MyCrosshair.AimDownSights.OuterLines.Opacity}\nOffset: ${MyCrosshair.AimDownSights.OuterLines.Offset}\nThickness: ${MyCrosshair.AimDownSights.OuterLines.Thickness}\n\nFiring Error: ${MyCrosshair.AimDownSights.OuterLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.AimDownSights.OuterLines.MovementError.Multiplier}`,
                    inline: true
                }));
            }
            if (MyCrosshair.SniperScope !== valorant_ts_1.Crosshair.Default.SniperScope) {
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Sniper Scope")
                    .setDescription(`Color: ${valorant_ts_1.Crosshair.Color[MyCrosshair.SniperScope.CenterDot.Color]}\nOpacity: ${MyCrosshair.SniperScope.CenterDot.Opacity}\nThickness: ${MyCrosshair.SniperScope.CenterDot.Thickness}`));
            }
            if (sendMessageArray === []) {
                return {
                    content: "Empty Crosshair",
                };
            }
            return {
                embeds: sendMessageArray,
            };
        });
    },
};
exports.default = __command;
