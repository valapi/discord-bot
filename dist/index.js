"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const process = tslib_1.__importStar(require("process"));
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs"));
const dotenv = tslib_1.__importStar(require("dotenv"));
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const _DevelopmentMode = false;
(async () => {
    dotenv.config({
        path: path.join(`${process.cwd()}/.env`),
    });
    mongoose_1.default.connection.on("error", (async (error) => {
        IngCore.Logs.log(error, 'error');
    }));
    mongoose_1.default.connection.on("connected", (async () => {
        IngCore.Logs.log('Successfully connected to database', 'system');
    }));
    mongoose_1.default.connection.on("disconnected", (async () => {
        IngCore.Logs.log('Disconnected from database', 'warning');
    }));
    await mongoose_1.default.connect(String(process.env['MONGO_TOKEN']));
    const DiscordBot = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.GuildMessageReactions,
            discord_js_1.GatewayIntentBits.DirectMessages,
            discord_js_1.GatewayIntentBits.DirectMessageReactions,
            discord_js_1.GatewayIntentBits.GuildIntegrations,
        ],
        partials: [
            discord_js_1.Partials.Channel,
            discord_js_1.Partials.GuildMember,
            discord_js_1.Partials.Message,
            discord_js_1.Partials.Reaction,
            discord_js_1.Partials.User,
        ],
        allowedMentions: {
            parse: ['users', 'roles'],
            repliedUser: true,
        },
        failIfNotExists: _DevelopmentMode,
    });
    const _CommandCollection = new discord_js_1.Collection();
    const _CommandList = [];
    IngCore.Logs.log('Started refreshing application (/) commands', 'info');
    for (const _folder of fs.readdirSync(path.join(`${__dirname}/components/commands`))) {
        for (const _file of fs.readdirSync(path.join(`${__dirname}/components/commands/${_folder}`))) {
            const command = require(`./components/commands/${_folder}/${_file}`).default;
            if (!command) {
                IngCore.Logs.log(command, 'error');
                continue;
            }
            if (command.echo && command.echo.data.length > 0) {
                command.echo.data.forEach((cmd) => {
                    if (typeof cmd === 'string') {
                        _CommandCollection.set(cmd, { ...command, ...{ data: { name: cmd }, echo: { from: command.command.name, data: [] } } });
                        _CommandList.push({ ...command.command.toJSON(), ...{ name: cmd } });
                    }
                    else {
                        const ofNewCommand = command.command.toJSON();
                        if (ofNewCommand.options) {
                            const OptionCommand = ofNewCommand.options.find(filterCmd => filterCmd.name === cmd.oldName);
                            if (OptionCommand && OptionCommand.type === v10_1.ApplicationCommandOptionType.Subcommand) {
                                if (!OptionCommand.options)
                                    OptionCommand.options = [];
                                const NewSlashCommand = {
                                    ...ofNewCommand,
                                    ...(new discord_js_1.SlashCommandBuilder().setName(cmd.newName).setDescription(OptionCommand.description).toJSON()),
                                    ...{
                                        options: OptionCommand.options,
                                    }
                                };
                                _CommandCollection.set(NewSlashCommand.name, { ...command, ...{ data: NewSlashCommand, echo: { from: command.command.name, command: [], subCommand: { baseCommand: OptionCommand.name, isSubCommand: true } } } });
                                _CommandList.push(NewSlashCommand);
                            }
                            else {
                                IngCore.Logs.log(`<${_file}> option command [${cmd.oldName}] not found`, 'error');
                            }
                        }
                    }
                });
            }
            _CommandCollection.set(command.command.name, command);
            _CommandList.push(command.command.toJSON());
        }
    }
    const rest = new rest_1.REST({ version: '10' }).setToken(String(process.env['TOKEN']));
    async function RestCommands(GlobalCommands, GuildCommands) {
        await rest.put(v10_1.Routes.applicationCommands(String(process.env['CLIENT_ID'])), {
            body: GlobalCommands,
        });
        await rest.put(v10_1.Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])), {
            body: GuildCommands,
        });
    }
    try {
        if (_DevelopmentMode === true) {
            await RestCommands([], _CommandList);
        }
        else {
            await RestCommands(_CommandList, []);
        }
        IngCore.Logs.log('Successfully reloaded application (/) commands', 'info');
    }
    catch (error) {
        IngCore.Logs.log(error, 'error');
    }
    const _MenuCollection = new discord_js_1.Collection();
    for (const _file of fs.readdirSync(path.join(`${__dirname}/components/menus`))) {
        const menu = require(`./components/menus/${_file}`).default;
        if (!menu) {
            IngCore.Logs.log(menu, 'error');
            continue;
        }
        _MenuCollection.set(menu.customId, menu);
    }
    const _ModalCollection = new discord_js_1.Collection();
    for (const _file of fs.readdirSync(path.join(`${__dirname}/components/modals`))) {
        const modal = require(`./components/modals/${_file}`).default;
        if (!modal) {
            IngCore.Logs.log(modal, 'error');
            continue;
        }
        _ModalCollection.set(modal.customId, modal);
    }
    DiscordBot.setMaxListeners(50);
    const _EventInput = {
        DiscordBot,
        _SlashCommand: {
            Collection: _CommandCollection,
            List: _CommandList,
        },
        _Menu: _MenuCollection,
        _Modal: _ModalCollection,
        _DevelopmentMode,
    };
    for (const _file of fs.readdirSync(path.join(`${__dirname}/events`))) {
        const event = require(`./events/${_file}`).default;
        if (!event) {
            continue;
        }
        if (event.once) {
            DiscordBot.once(event.name, (async (...args) => {
                try {
                    await event.execute(_EventInput, ...args);
                }
                catch (error) {
                    IngCore.Logs.log(error, 'error');
                }
            }));
        }
        else {
            DiscordBot.on(event.name, (async (...args) => {
                try {
                    await event.execute(_EventInput, ...args);
                }
                catch (error) {
                    IngCore.Logs.log(error, 'error');
                }
            }));
        }
    }
    await DiscordBot.login(process.env['TOKEN']);
    if (_DevelopmentMode === true) {
        DiscordBot.user?.setStatus('invisible');
    }
    else {
        DiscordBot.user?.setStatus('online');
        DiscordBot.user?.setActivity({
            name: "ING PROJECT",
            type: discord_js_1.ActivityType.Playing,
        });
    }
})();
