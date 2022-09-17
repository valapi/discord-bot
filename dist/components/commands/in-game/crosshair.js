"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const valorant_ts_1 = require("valorant.ts");
const lib_1 = require("@valapi/lib");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('crosshair')
        .setDescription('About My Crosshair')
        .addStringOption(option => option
        .setName('code')
        .setDescription('Crosshair Code')
        .setRequired(true))),
    category: 'valorant',
    execute({ interaction }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const MyCrosshair = valorant_ts_1.Crosshair.fromStringToJson(interaction.options.getString('code', true));
            const sendMessageArray = [];
            if (MyCrosshair.Primary !== valorant_ts_1.Crosshair.Default.Primary) {
                const _COLOR = (Number(MyCrosshair.Primary.Crosshair.CrosshairColor).toString() === MyCrosshair.Primary.Crosshair.CrosshairColor) ? lib_1.CrosshairColor.fromString(MyCrosshair.Primary.Crosshair.CrosshairColor).replace("_", " ") : MyCrosshair.Primary.Crosshair.CrosshairColor;
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Primary")
                    .addFields({
                    name: "Crosshair",
                    value: `Color: ${_COLOR}\n\nCenter Dot Opacity: ${MyCrosshair.Primary.Crosshair.CenterDot.Opacity}\nCenter Dot Thickness: ${MyCrosshair.Primary.Crosshair.CenterDot.Thickness}\n\nOutLine Opacity: ${MyCrosshair.Primary.Crosshair.OutLine.Opacity}\nOutLine Thickness: ${MyCrosshair.Primary.Crosshair.OutLine.Thickness}`,
                    inline: true
                }, {
                    name: "Inner Lines",
                    value: `Length: ${MyCrosshair.Primary.InnerLines.Length.Value}${(MyCrosshair.Primary.InnerLines.Length.isChain) ? ` / ${MyCrosshair.Primary.InnerLines.Length.SecondValue}` : ""}\nOpacity: ${MyCrosshair.Primary.InnerLines.Opacity}\nOffset: ${MyCrosshair.Primary.InnerLines.Offset}\nThickness: ${MyCrosshair.Primary.InnerLines.Thickness}\n\nFiring Error: ${MyCrosshair.Primary.InnerLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.Primary.InnerLines.MovementError.Multiplier}`,
                    inline: true
                }, {
                    name: "Outer Lines",
                    value: `Length: ${MyCrosshair.Primary.OuterLines.Length.Value}${(MyCrosshair.Primary.OuterLines.Length.isChain) ? ` / ${MyCrosshair.Primary.OuterLines.Length.SecondValue}` : ""}\nOpacity: ${MyCrosshair.Primary.OuterLines.Opacity}\nOffset: ${MyCrosshair.Primary.OuterLines.Offset}\nThickness: ${MyCrosshair.Primary.OuterLines.Thickness}\n\nFiring Error: ${MyCrosshair.Primary.OuterLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.Primary.OuterLines.MovementError.Multiplier}`,
                    inline: true
                }));
            }
            if (MyCrosshair.AimDownSights !== valorant_ts_1.Crosshair.Default.AimDownSights) {
                const _COLOR = (Number(MyCrosshair.AimDownSights.Crosshair.CrosshairColor).toString() === MyCrosshair.AimDownSights.Crosshair.CrosshairColor) ? lib_1.CrosshairColor.fromString(MyCrosshair.AimDownSights.Crosshair.CrosshairColor).replace("_", " ") : MyCrosshair.AimDownSights.Crosshair.CrosshairColor;
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Aim Down Sights")
                    .addFields({
                    name: "Crosshair",
                    value: `Color: ${_COLOR}\n\nCenter Dot Opacity: ${MyCrosshair.AimDownSights.Crosshair.CenterDot.Opacity}\nCenter Dot Thickness: ${MyCrosshair.AimDownSights.Crosshair.CenterDot.Thickness}\n\nOutLine Opacity: ${MyCrosshair.AimDownSights.Crosshair.OutLine.Opacity}\nOutLine Thickness: ${MyCrosshair.AimDownSights.Crosshair.OutLine.Thickness}`,
                    inline: true
                }, {
                    name: "Inner Lines",
                    value: `Length: ${MyCrosshair.AimDownSights.InnerLines.Length.Value}${(MyCrosshair.AimDownSights.InnerLines.Length.isChain) ? ` / ${MyCrosshair.AimDownSights.InnerLines.Length.SecondValue}` : ""}\nOpacity: ${MyCrosshair.AimDownSights.InnerLines.Opacity}\nOffset: ${MyCrosshair.AimDownSights.InnerLines.Offset}\nThickness: ${MyCrosshair.AimDownSights.InnerLines.Thickness}\n\nFiring Error: ${MyCrosshair.AimDownSights.InnerLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.AimDownSights.InnerLines.MovementError.Multiplier}`,
                    inline: true
                }, {
                    name: "Outer Lines",
                    value: `Length: ${MyCrosshair.AimDownSights.OuterLines.Length.Value}${(MyCrosshair.AimDownSights.OuterLines.Length.isChain) ? ` / ${MyCrosshair.AimDownSights.OuterLines.Length.SecondValue}` : ""}\nOpacity: ${MyCrosshair.AimDownSights.OuterLines.Opacity}\nOffset: ${MyCrosshair.AimDownSights.OuterLines.Offset}\nThickness: ${MyCrosshair.AimDownSights.OuterLines.Thickness}\n\nFiring Error: ${MyCrosshair.AimDownSights.OuterLines.FiringError.Multiplier}\nMovement Error: ${MyCrosshair.AimDownSights.OuterLines.MovementError.Multiplier}`,
                    inline: true
                }));
            }
            if (MyCrosshair.SniperScope !== valorant_ts_1.Crosshair.Default.SniperScope) {
                const _COLOR = (Number(MyCrosshair.SniperScope.CenterDot.Color).toString() === MyCrosshair.SniperScope.CenterDot.Color) ? lib_1.CrosshairColor.fromString(MyCrosshair.SniperScope.CenterDot.Color).replace("_", " ") : MyCrosshair.SniperScope.CenterDot.Color;
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Sniper Scope")
                    .setDescription(`Color: ${_COLOR}\nOpacity: ${MyCrosshair.SniperScope.CenterDot.Opacity}\nThickness: ${MyCrosshair.SniperScope.CenterDot.Thickness}`));
            }
            if (sendMessageArray.length === 0) {
                return {
                    content: "Default Crosshair",
                };
            }
            return {
                embeds: sendMessageArray,
            };
        });
    },
};
exports.default = __command;
