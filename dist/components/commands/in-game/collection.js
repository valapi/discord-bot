"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('collection')
        .setDescription('Items Collection')),
    category: 'valorant',
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        const userId = interaction.user.id;
        const { WebClient, ValorantApiCom, isValorAccountFind } = await (0, accounts_1.ValorAccount)({
            userId,
            apiKey,
            language: language.name,
        });
        if (isValorAccountFind === false) {
            return {
                content: language.data.command['account']['not_account'],
            };
        }
        const puuid = WebClient.getSubject();
        const GetLoadout = await WebClient.Player.Loadout(puuid);
        const AllGuns = GetLoadout.data.Guns;
        const AllSprays = GetLoadout.data.Sprays;
        const TheIdentity = GetLoadout.data.Identity;
        const createEmbed = new discord_js_1.EmbedBuilder();
        let sendGunMessage = '';
        for (const ofGun of AllGuns) {
            const GunId = ofGun.SkinID;
            const GetGunData = await ValorantApiCom.Weapons.getSkinByUuid(GunId);
            if (GetGunData.isError || !GetGunData.data.data) {
                continue;
            }
            const GunName = GetGunData.data.data.displayName;
            sendGunMessage += ` ${GunName}\n`;
        }
        let sendSprayMessage = '';
        let _DISPLAY = '';
        for (const ofTheSpray in AllSprays) {
            const ofSpray = AllSprays[ofTheSpray];
            const SprayID = ofSpray.SprayID;
            const GetSprayData = await ValorantApiCom.Sprays.getByUuid(SprayID);
            if (GetSprayData.isError || !GetSprayData.data.data) {
                continue;
            }
            const SprayName = GetSprayData.data.data.displayName;
            sendSprayMessage += ` ${SprayName}\n`;
            if (_DISPLAY && (IngCore.Random(0, 2) >= 1)) {
                continue;
            }
            _DISPLAY = GetSprayData.data.data.fullTransparentIcon;
        }
        createEmbed.setThumbnail(_DISPLAY);
        const PlayerCardId = TheIdentity.PlayerCardID;
        const GetCardData = await ValorantApiCom.PlayerCards.getByUuid(PlayerCardId);
        createEmbed.addFields({ name: 'Player Card', value: `${GetCardData.data.data?.displayName}`, inline: true });
        createEmbed.setImage(GetCardData.data.data?.wideArt);
        const PlayerTitleId = TheIdentity.PlayerTitleID;
        const GetTitleData = await ValorantApiCom.PlayerTitles.getByUuid(PlayerTitleId);
        if (!GetTitleData.data.data?.titleText) {
            createEmbed.addFields({ name: 'Player Title', value: `${GetTitleData.data.data?.displayName} - ${GetTitleData.data.data?.titleText}`, inline: true });
        }
        createEmbed
            .setTimestamp(createdTime)
            .setDescription(language.data.command['collection']['default'])
            .addFields({ name: '\u200B', value: '\u200B' }, {
            name: 'Weapons',
            value: `${sendGunMessage}`,
            inline: true,
        }, {
            name: 'Sprays',
            value: `${sendSprayMessage}`,
            inline: true,
        })
            .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
        return {
            embeds: [createEmbed],
        };
    },
};
exports.default = __command;
