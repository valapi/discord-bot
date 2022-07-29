"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process = tslib_1.__importStar(require("process"));
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const lang_1 = require("../lang");
const discord_js_1 = require("discord.js");
const crypto_1 = require("../utils/crypto");
const __event = {
    name: 'interactionCreate',
    once: false,
    async execute({ _SlashCommand, _Menu, _Modal, _DevelopmentMode, DiscordBot }, interaction) {
        if (_DevelopmentMode === true && interaction.guild?.id !== String(process.env['GUILD_ID'])) {
            return;
        }
        const createdTime = new Date();
        const language = (0, lang_1.getLanguageAndUndefined)(IngCore.Cache.output({ name: 'languages', interactionId: String(interaction.guildId) }));
        let _isInteractionReplied = false;
        async function interactionReply(interaction, data) {
            if (_isInteractionReplied === false) {
                await interaction.reply({ ...data, ...{ tts: false, fetchReply: true } });
                _isInteractionReplied = true;
            }
            else {
                await interaction.editReply(data);
            }
        }
        if (interaction.isChatInputCommand()) {
            const command = {
                ...{
                    command: ((new discord_js_1.SlashCommandBuilder().setName('default')).setDescription('Default command')),
                    category: 'miscellaneous',
                    permissions: [],
                    isPrivateMessage: false,
                    onlyGuild: false,
                    inDevlopment: false,
                    showDeferReply: true,
                    execute: (async () => { return { content: 'This is Default message.', }; }),
                },
                ..._SlashCommand.Collection.get(interaction.commandName)
            };
            if (command.showDeferReply === true) {
                await interaction.deferReply({
                    ephemeral: command.isPrivateMessage,
                    fetchReply: true,
                });
                _isInteractionReplied = true;
            }
            try {
                if (command.inDevlopment === true && interaction.user.id !== '549231132382855189') {
                    await interactionReply(interaction, {
                        content: language.data['dev_cmd'] || 'This command is in development.',
                    });
                    return;
                }
                if (!interaction.guild && command.onlyGuild === true) {
                    await interactionReply(interaction, {
                        content: language.data['not_guild'] || 'Slash Command are only available in server.',
                    });
                    return;
                }
                if (command.echo) {
                    if (command.echo.from) {
                        interaction.commandName = command.echo.from;
                        if (interaction.command) {
                            interaction.command.name = command.echo.from;
                        }
                    }
                    if (command.echo.subCommand && command.echo.subCommand.isSubCommand === true) {
                        interaction.options.getSubcommand = (() => {
                            return String(command.echo?.subCommand?.baseCommand);
                        });
                    }
                }
                if (command.permissions && !interaction.memberPermissions?.has(command.permissions)) {
                    await interactionReply(interaction, {
                        content: language.data['not_permission'] || `You don't have permission to use this command.`,
                    });
                    return;
                }
                IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName}\x1b[0m`, 'info');
                const TheCommand = await command.execute({
                    interaction,
                    DiscordBot,
                    createdTime,
                    language,
                    apiKey: (0, crypto_1.genarateApiKey)(String(`${interaction.user.id}${interaction.user.createdTimestamp}${interaction.user.username}${interaction.user.tag}`), String(`${interaction.guild?.id}${interaction.guild?.ownerId}`) + String(`${interaction.guild?.createdTimestamp}`), String(process.env['PUBLIC_KEY'])),
                });
                if (TheCommand) {
                    await interactionReply(interaction, TheCommand);
                }
                else {
                    await IngCore.Wait(10 * 1000);
                }
                IngCore.Logs.log(`<${interaction.user.id}> <command> ${interaction.commandName} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            }
            catch (error) {
                if (_DevelopmentMode === true) {
                    console.error(error);
                }
                else {
                    IngCore.Logs.log(error, 'error');
                }
                await interactionReply(interaction, {
                    content: language.data['error'] || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: [],
                    attachments: [],
                });
            }
        }
        else if (interaction.isSelectMenu()) {
            const menu = {
                ...{
                    customId: 'default',
                    replyMode: 'edit',
                    execute: (async () => { return { content: 'This is Default message.', }; }),
                },
                ..._Menu.get(interaction.customId)
            };
            if (menu.replyMode === 'edit') {
                await interaction.deferUpdate({
                    fetchReply: true,
                });
                _isInteractionReplied = true;
            }
            else if (menu.replyMode === 'new') {
                await interaction.deferReply({
                    fetchReply: true,
                });
            }
            try {
                IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId}\x1b[0m`, 'info');
                const TheMenu = await menu.execute({
                    interaction,
                    DiscordBot,
                    language,
                    _SlashCommand,
                });
                await interactionReply(interaction, TheMenu);
                IngCore.Logs.log(`<${interaction.user.id}> <menu> ${interaction.customId} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            }
            catch (error) {
                if (_DevelopmentMode === true) {
                    console.error(error);
                }
                else {
                    IngCore.Logs.log(error, 'error');
                }
                await interactionReply(interaction, {
                    content: language.data['error'] || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: [],
                    attachments: [],
                });
            }
        }
        if (interaction.type === discord_js_1.InteractionType.ModalSubmit) {
            const modal = {
                ...{
                    customId: 'default',
                    execute: (async () => { return { content: 'This is Default message.', }; }),
                },
                ..._Modal.get(interaction.customId)
            };
            try {
                IngCore.Logs.log(`<${interaction.user.id}> <modal> ${interaction.customId}\x1b[0m`, 'info');
                if (_isInteractionReplied === true) {
                    interaction.editReply({
                        content: language.data['error'] || `Something Went Wrong, Please Try Again Later`,
                    });
                    return;
                }
                const TheModal = await modal.execute({
                    interaction,
                    DiscordBot,
                    language,
                });
                await interaction.reply({ ...TheModal, ...{ tts: false, fetchReply: true } });
                _isInteractionReplied = true;
                IngCore.Logs.log(`<${interaction.user.id}> <modal> ${interaction.customId} [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`, 'info');
            }
            catch (error) {
                if (_DevelopmentMode === true) {
                    console.error(error);
                }
                else {
                    IngCore.Logs.log(error, 'error');
                }
                await interactionReply(interaction, {
                    content: language.data['error'] || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: [],
                    attachments: [],
                });
            }
        }
    },
};
exports.default = __event;
