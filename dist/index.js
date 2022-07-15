"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
const process = tslib_1.__importStar(require("process"));
const fs = tslib_1.__importStar(require("fs"));
const discord_modals_1 = tslib_1.__importDefault(require("discord-modals"));
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const discord_js_1 = require("discord.js");
const events_1 = tslib_1.__importDefault(require("events"));
const core_1 = require("@ing3kth/core");
const database_1 = require("./utils/database");
const DEVELOPMENT_MODE = false;
function START_ENGINE() {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        //dotenv
        dotenv.config({
            path: process.cwd() + '/.env'
        });
        //database
        yield database_1.ValData.create(process.env['MONGO_TOKEN']);
        //client
        const DiscordClient = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
                discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS,
            ],
        });
        events_1.default.defaultMaxListeners = 35;
        DiscordClient.setMaxListeners(50);
        (0, discord_modals_1.default)(DiscordClient);
        //handle command
        const commandFolders = fs.readdirSync(`${process.cwd()}/dist/commands/slash`);
        const rest = new rest_1.REST({ version: '10' }).setToken(String(process.env['TOKEN']));
        const _commands = new discord_js_1.Collection();
        const _commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${process.cwd()}/dist/commands/slash/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`${process.cwd()}/dist/commands/slash/${folder}/${file.replace('.js', '')}`).default;
                if (!command) {
                    continue;
                }
                if (command.echo && command.echo.command.length > 0) {
                    command.echo.command.forEach((cmd) => {
                        if (typeof cmd === 'string') {
                            _commands.set(cmd, new Object(Object.assign(Object.assign({}, command), { data: { name: cmd }, echo: { from: command.data.name, command: [] }, privateMessage: !!command.privateMessage })));
                            _commandArray.push(new Object(Object.assign(Object.assign({}, command.data.toJSON()), { name: cmd })));
                        }
                        else {
                            let ofNewCommand = command.data.toJSON();
                            if (ofNewCommand.options) {
                                let OptionCommand = ofNewCommand.options.find(filterCmd => filterCmd.name === cmd.subCommandName);
                                if (OptionCommand && OptionCommand.type === 1) {
                                    if (!OptionCommand.options)
                                        OptionCommand.options = [];
                                    let NewSlashCommand = new Object(Object.assign(Object.assign({}, ofNewCommand), {
                                        type: OptionCommand.type,
                                        name: cmd.newCommandName,
                                        description: OptionCommand.description,
                                        options: OptionCommand.options,
                                    }));
                                    _commands.set(NewSlashCommand.name, new Object(Object.assign(Object.assign({}, command), { data: NewSlashCommand, echo: { from: command.data.name, command: [], subCommand: { baseCommand: OptionCommand.name, isSubCommand: true } }, privateMessage: !!command.privateMessage })));
                                    _commandArray.push(NewSlashCommand);
                                }
                                else {
                                    core_1.Logs.log(`<${file}> option command [${cmd.subCommandName}] not found`, 'error');
                                }
                            }
                        }
                    });
                }
                _commands.set(command.data.name, command);
                _commandArray.push(command.data.toJSON());
            }
        }
        try {
            yield core_1.Logs.log('Started refreshing application (/) commands.', 'info');
            if (DEVELOPMENT_MODE) {
                yield rest.put(v10_1.Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])), { body: _commandArray });
            }
            else {
                yield rest.put(v10_1.Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])), { body: [] });
                yield rest.put(v10_1.Routes.applicationCommands(String(process.env['CLIENT_ID'])), { body: _commandArray });
            }
            yield core_1.Logs.log('Successfully reloaded application (/) commands.', 'info');
        }
        catch (error) {
            yield core_1.Logs.log(error, 'error');
        }
        //handle events
        const eventFiles = fs.readdirSync(process.cwd() + '/dist/events').filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`./events/${file.replace('.js', '')}`).default;
            if (!event) {
                continue;
            }
            const _extraData = {
                client: DiscordClient,
                commands: _commands,
                commandArray: _commandArray,
            };
            if (event.once) {
                DiscordClient.once(event.name, ((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        yield event.execute(...args, _extraData);
                    }
                    catch (error) {
                        yield core_1.Logs.log(error, 'error');
                    }
                })));
            }
            else {
                DiscordClient.on(event.name, ((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        yield event.execute(...args, _extraData);
                    }
                    catch (error) {
                        yield core_1.Logs.log(error, 'error');
                    }
                })));
            }
        }
        //login
        yield DiscordClient.login(process.env['TOKEN']);
        (_a = DiscordClient.user) === null || _a === void 0 ? void 0 : _a.setActivity("ING PROJECT", {
            type: "PLAYING"
        });
        DiscordClient.setMaxListeners(100);
    });
}
;
function LOAD_ENGINE() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield START_ENGINE();
        }
        catch (error) {
            yield core_1.Logs.log(error, 'error');
            setTimeout((() => tslib_1.__awaiter(this, void 0, void 0, function* () { yield LOAD_ENGINE(); })), 1000);
        }
    });
}
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    //the loop will run 3 time on error
    yield LOAD_ENGINE();
}))();
