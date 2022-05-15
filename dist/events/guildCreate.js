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
const core_1 = require("@ing3kth/core");
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
//when join a guild
exports.default = {
    name: 'guildCreate',
    once: false,
    execute(guild, _extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new rest_1.REST({ version: '10' }).setToken(String(process.env['TOKEN']));
            //fetch commands
            try {
                yield core_1.Logs.log('Started refreshing application (/) commands. in guidId ' + guild.id, 'info');
                yield rest.put(v10_1.Routes.applicationGuildCommands(String(process.env['CLIENT_ID']), String(guild.id)), { body: _extraData.commandArray });
                yield core_1.Logs.log('Successfully reloaded application (/) commands. in guidId ' + guild.id, 'info');
            }
            catch (error) {
                yield core_1.Logs.log(error, 'error');
            }
        });
    },
};
//# sourceMappingURL=guildCreate.js.map