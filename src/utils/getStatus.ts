import * as process from 'process';
import { ToMilliseconds } from '@ing3kth/core/dist/utils/Milliseconds';

import type { Client } from 'discord.js';

async function getStatus(DiscordClient: Client, createdTime: number) {
    // UPTIME //
    const _uptime = ToMilliseconds(process.uptime() * 1000);

    // STATUS //
    const _status = Number(DiscordClient.user?.presence.status);

    // PING //

    //discord.js ping

    const discord_now = new Date().getTime();
    const discord_create = createdTime;
    const discord_ping = discord_now - discord_create

    //client ping
    const client_ping = Math.round(DiscordClient.ws.ping)

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
}

export default getStatus;