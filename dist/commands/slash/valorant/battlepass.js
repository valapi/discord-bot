"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//common
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
//valorant common
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
//valorant
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
const _CurrentBattlePassContractId = 'd80f3ef5-44f5-8d70-6935-f2840b2d3882';
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('battlepass')
        .setDescription('Valorant Battle Pass'),
    type: 'valorant',
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const ValDatabase = (yield database_1.ValData.verify()).getCollection();
            const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: userId });
            //valorant
            const ValApiCom = new valorant_api_com_1.Client({
                language: (language.name).replace('_', '-'),
            });
            const ValClient = new api_wrapper_1.Client({
                region: "ap",
                autoReconnect: true,
            });
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            //get
            if (!ValAccountInDatabase.isFind) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const SaveAccount = ValAccountInDatabase.once.account;
            ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
            //success
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            const AllContracts = (yield ValClient.Contract.Fetch(puuid)).data.Contracts;
            const BattlePassContract = AllContracts.find((item) => item.ContractDefinitionID === _CurrentBattlePassContractId);
            let BP_Id = BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ContractDefinitionID;
            let BP_CurrentLevel = Number(BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ProgressionLevelReached);
            let BP_XpAtNow = BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ProgressionTowardsNextLevel;
            let BP_TotalEarnedXp = (_a = BattlePassContract === null || BattlePassContract === void 0 ? void 0 : BattlePassContract.ContractProgression) === null || _a === void 0 ? void 0 : _a.TotalProgressionEarned;
            const TheBattlePass = yield ValApiCom.Contracts.getByUuid(BP_Id);
            let BP_Name = (_b = TheBattlePass.data.data) === null || _b === void 0 ? void 0 : _b.displayName;
            //slot
            let _ofSlot = BP_CurrentLevel % 5;
            let _Slot = 0;
            for (let i = 0; i < Number((_c = TheBattlePass.data.data) === null || _c === void 0 ? void 0 : _c.content.chapters.length); i++) {
                if ((i * 5) + _ofSlot === BP_CurrentLevel) {
                    _Slot = i;
                    break;
                }
            }
            let BP_CurrentSlot = (_d = TheBattlePass.data.data) === null || _d === void 0 ? void 0 : _d.content.chapters[_Slot];
            let BP_LevelSlot = BP_CurrentSlot === null || BP_CurrentSlot === void 0 ? void 0 : BP_CurrentSlot.levels[_ofSlot];
            //slot data
            let BP_Slot_ID = BP_LevelSlot === null || BP_LevelSlot === void 0 ? void 0 : BP_LevelSlot.reward.uuid;
            let BP_Slot_XpNeed = BP_LevelSlot === null || BP_LevelSlot === void 0 ? void 0 : BP_LevelSlot.xp;
            let BP_Slot_Name = ``;
            let BP_Slot_Description = ``;
            let BP_Slot_Display = ``;
            switch (BP_LevelSlot === null || BP_LevelSlot === void 0 ? void 0 : BP_LevelSlot.reward.type) {
                case 'EquippableSkinLevel': //weapon skin
                    const SlotData_0 = yield ValApiCom.Weapons.getSkinLevelByUuid(BP_Slot_ID);
                    if (SlotData_0.isError || !SlotData_0.data.data)
                        throw new Error('Data Not Found!');
                    BP_Slot_Name = SlotData_0.data.data.displayName;
                    BP_Slot_Display = SlotData_0.data.data.displayIcon;
                    break;
                case 'EquippableCharmLevel': //buddy
                    const SlotData_1 = yield ValApiCom.Buddies.getLevelByUuid(BP_Slot_ID);
                    if (SlotData_1.isError || !SlotData_1.data.data)
                        throw new Error('Data 1 Not Found!');
                    BP_Slot_Name = SlotData_1.data.data.displayName;
                    BP_Slot_Display = SlotData_1.data.data.displayIcon;
                    break;
                case 'Currency':
                    const SlotData_2 = yield ValApiCom.Currencies.getByUuid(BP_Slot_ID);
                    if (SlotData_2.isError || !SlotData_2.data.data)
                        throw new Error('Data 2 Not Found!');
                    BP_Slot_Name = SlotData_2.data.data.displayName;
                    BP_Slot_Display = SlotData_2.data.data.displayIcon;
                    break;
                case 'PlayerCard':
                    const SlotData_3 = yield ValApiCom.PlayerCards.getByUuid(BP_Slot_ID);
                    if (SlotData_3.isError || !SlotData_3.data.data)
                        throw new Error('Data 3 Not Found!');
                    BP_Slot_Name = SlotData_3.data.data.displayName;
                    BP_Slot_Display = SlotData_3.data.data.displayIcon;
                    break;
                case 'Spray':
                    const SlotData_4 = yield ValApiCom.Sprays.getByUuid(BP_Slot_ID);
                    if (SlotData_4.isError || !SlotData_4.data.data)
                        throw new Error('Data 4 Not Found!');
                    BP_Slot_Name = SlotData_4.data.data.displayName;
                    BP_Slot_Display = SlotData_4.data.data.displayIcon;
                    break;
                case 'Title':
                    const SlotData_5 = yield ValApiCom.PlayerTitles.getByUuid(BP_Slot_ID);
                    if (SlotData_5.isError || !SlotData_5.data.data)
                        throw new Error('Data 5 Not Found!');
                    BP_Slot_Name = SlotData_5.data.data.displayName;
                    BP_Slot_Description = SlotData_5.data.data.titleText;
                    break;
                default:
                    throw new Error('Type of slot Not Found!');
            }
            let ShowSlot = `${_Slot + 1}`;
            if (_Slot >= 11)
                ShowSlot = 'Epilogue';
            const createEmbed = new discord_js_1.MessageEmbed()
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
            yield interaction.editReply({
                embeds: [createEmbed],
            });
        });
    }
};
//# sourceMappingURL=battlepass.js.map