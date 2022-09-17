"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const _CurrentBattlePassContractId = "99ac9283-4dd3-5248-2e01-8baf778affb4";
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('battlepass')
        .setDescription('Battle Pass')),
    category: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { WebClient, ValorantApiCom, isValorAccountFind } = yield (0, accounts_1.ValorAccount)({
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
            const AllContracts = (yield WebClient.Contract.fetch(puuid)).data.Contracts;
            const BattlePassContract = AllContracts.find((item) => item.ContractDefinitionID === _CurrentBattlePassContractId);
            const BP_Id = BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ContractDefinitionID;
            const BP_CurrentLevel = Number(BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ProgressionLevelReached);
            const BP_XpAtNow = BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ProgressionTowardsNextLevel;
            const BP_TotalEarnedXp = (_a = BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ContractProgression) === null || _a === void 0 ? void 0 : _a.TotalProgressionEarned;
            const TheBattlePass = yield ValorantApiCom.Contracts.getByUuid(BP_Id);
            const BP_Name = (_b = TheBattlePass.data.data) === null || _b === void 0 ? void 0 : _b.displayName;
            const _ofSlot = BP_CurrentLevel % 5;
            let _Slot = 0;
            for (let i = 0; i < Number((_c = TheBattlePass.data.data) === null || _c === void 0 ? void 0 : _c.content.chapters.length); i++) {
                if ((i * 5) + _ofSlot === BP_CurrentLevel) {
                    _Slot = i;
                    break;
                }
            }
            const BP_CurrentSlot = (_d = TheBattlePass.data.data) === null || _d === void 0 ? void 0 : _d.content.chapters[_Slot];
            const BP_LevelSlot = BP_CurrentSlot === null || BP_CurrentSlot === void 0 ? void 0 : BP_CurrentSlot.levels[_ofSlot];
            const BP_Slot_ID = BP_LevelSlot === null || BP_LevelSlot === void 0 ? void 0 : BP_LevelSlot.reward.uuid;
            const BP_Slot_XpNeed = BP_LevelSlot === null || BP_LevelSlot === void 0 ? void 0 : BP_LevelSlot.xp;
            let BP_Slot_Name = ``;
            let BP_Slot_Description = ``;
            let BP_Slot_Display = ``;
            switch (BP_LevelSlot === null || BP_LevelSlot === void 0 ? void 0 : BP_LevelSlot.reward.type) {
                case 'EquippableSkinLevel': {
                    const SlotData_0 = yield ValorantApiCom.Weapons.getSkinLevelByUuid(BP_Slot_ID);
                    if (SlotData_0.isError || !SlotData_0.data.data) {
                        throw 'EquippableSkinLevel Not Found!';
                    }
                    BP_Slot_Name = SlotData_0.data.data.displayName;
                    BP_Slot_Display = SlotData_0.data.data.displayIcon;
                    break;
                }
                case 'EquippableCharmLevel': {
                    const SlotData_1 = yield ValorantApiCom.Buddies.getLevelByUuid(BP_Slot_ID);
                    if (SlotData_1.isError || !SlotData_1.data.data) {
                        throw 'EquippableCharmLevel Not Found!';
                    }
                    BP_Slot_Name = SlotData_1.data.data.displayName;
                    BP_Slot_Display = SlotData_1.data.data.displayIcon;
                    break;
                }
                case 'Currency': {
                    const SlotData_2 = yield ValorantApiCom.Currencies.getByUuid(BP_Slot_ID);
                    if (SlotData_2.isError || !SlotData_2.data.data) {
                        throw 'Currency Not Found!';
                    }
                    BP_Slot_Name = SlotData_2.data.data.displayName;
                    BP_Slot_Display = SlotData_2.data.data.displayIcon;
                    break;
                }
                case 'PlayerCard': {
                    const SlotData_3 = yield ValorantApiCom.PlayerCards.getByUuid(BP_Slot_ID);
                    if (SlotData_3.isError || !SlotData_3.data.data) {
                        throw 'PlayerCard Not Found!';
                    }
                    BP_Slot_Name = SlotData_3.data.data.displayName;
                    BP_Slot_Display = SlotData_3.data.data.displayIcon;
                    break;
                }
                case 'Spray': {
                    const SlotData_4 = yield ValorantApiCom.Sprays.getByUuid(BP_Slot_ID);
                    if (SlotData_4.isError || !SlotData_4.data.data) {
                        throw 'Spray Not Found!';
                    }
                    BP_Slot_Name = SlotData_4.data.data.displayName;
                    BP_Slot_Display = SlotData_4.data.data.displayIcon;
                    break;
                }
                case 'Title': {
                    const SlotData_5 = yield ValorantApiCom.PlayerTitles.getByUuid(BP_Slot_ID);
                    if (SlotData_5.isError || !SlotData_5.data.data) {
                        throw 'Title Not Found!';
                    }
                    BP_Slot_Name = SlotData_5.data.data.displayName;
                    BP_Slot_Description = SlotData_5.data.data.titleText;
                    break;
                }
                default: {
                    throw 'Type of slot Not Found!';
                }
            }
            let ShowSlot = `${_Slot + 1}`;
            if (_Slot >= 11)
                ShowSlot = 'Epilogue';
            const createEmbed = new discord_js_1.EmbedBuilder()
                .setColor('#0099ff')
                .setTimestamp(createdTime)
                .addFields({ name: '\u200B', value: '\u200B' }, {
                name: 'Level',
                value: `${BP_CurrentLevel + 1}`,
                inline: true,
            }, {
                name: 'Chapter',
                value: `${ShowSlot}`,
                inline: true,
            }, {
                name: 'Name',
                value: `${BP_Slot_Name}`,
                inline: true,
            }, { name: '\u200B', value: '\u200B' }, {
                name: 'XP (level)',
                value: `**${BP_XpAtNow}** */* ${BP_Slot_XpNeed}`,
                inline: true,
            }, {
                name: 'XP (total)',
                value: `${BP_TotalEarnedXp}`,
                inline: true,
            }, { name: '\u200B', value: '\u200B' })
                .setAuthor({ name: `${BP_Name}` })
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });
            if (BP_Slot_Display)
                createEmbed.setThumbnail(BP_Slot_Display);
            if (BP_Slot_Description)
                createEmbed.setDescription(BP_Slot_Description);
            return {
                embeds: [createEmbed],
            };
        });
    },
};
exports.default = __command;
