"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
const process = __importStar(require("process"));
const fs = __importStar(require("fs"));
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const discord_js_1 = require("discord.js");
const core_1 = require("@ing3kth/core");
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //dotenv
    dotenv.config({
        path: process.cwd() + '/.env'
    });
    //set maxListeners Limit
    require('events').EventEmitter.defaultMaxListeners = 35;
    const DiscordClient = new discord_js_1.Client({
        intents: [
            discord_js_1.Intents.FLAGS.GUILDS,
            discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
            discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        ],
    });
    //handle command
    const commandFolders = fs.readdirSync(process.cwd() + '/dist/commands');
    const rest = new rest_1.REST({ version: '10' }).setToken(String(process.env['TOKEN']));
    const _commands = new discord_js_1.Collection();
    const _commandArray = [];
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(process.cwd() + `/dist/commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`).default;
            _commands.set(command.data.name, command);
            _commandArray.push(command.data.toJSON());
        }
    }
    try {
        yield core_1.Logs.log('Started refreshing application (/) commands.', 'info');
        yield rest.put(v10_1.Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(process.env['GUILD_ID'])), 
        //Routes.applicationCommands(String(process.env['CLIENT_ID']),
        { body: _commandArray });
        yield core_1.Logs.log('Successfully reloaded application (/) commands.', 'info');
    }
    catch (error) {
        yield core_1.Logs.log(error, 'error');
    }
    //handle events
    const eventFiles = fs.readdirSync(process.cwd() + '/dist/events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`).default;
        const _extraData = {
            client: DiscordClient,
            commands: _commands,
            commandArray: _commandArray,
        };
        if (event.once) {
            DiscordClient.once(event.name, (...args) => event.execute(...args, _extraData));
        }
        else {
            DiscordClient.on(event.name, (...args) => event.execute(...args, _extraData));
        }
    }
    //login
    yield DiscordClient.login(process.env['TOKEN']);
    yield ((_a = DiscordClient.user) === null || _a === void 0 ? void 0 : _a.setActivity("ING PROJECT", {
        type: "PLAYING"
    }));
}))();
//# sourceMappingURL=index.js.map