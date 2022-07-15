"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process = tslib_1.__importStar(require("process"));
const Milliseconds_1 = require("@ing3kth/core/dist/utils/Milliseconds");
// MATH EXPLAIN //
// Math.round() // most nearest number
// Math.floor() // down
// Math.ceil()  // up
function getStatus(DiscordClient, createdTime) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // PING //
        //discord.js ping
        const discord_now = new Date().getTime();
        const discord_create = createdTime;
        const discord_ping = discord_now - discord_create;
        //client ping
        const client_ping = Math.round(DiscordClient.ws.ping);
        // UPTIME //
        const _uptime = (0, Milliseconds_1.ToMilliseconds)(process.uptime() * 1000);
        // STATUS //
        const _status = Number((_a = DiscordClient.user) === null || _a === void 0 ? void 0 : _a.presence.status);
        //return
        return {
            uptime: _uptime.data,
            status: _status,
            ping: {
                data: {
                    discordApi: discord_ping,
                    client: client_ping
                },
                average: Math.round((discord_ping + client_ping) / 2)
            },
        };
    });
}
exports.default = getStatus;
