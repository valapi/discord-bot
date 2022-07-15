import type { Client } from 'discord.js';
declare function getStatus(DiscordClient: Client, createdTime: number): Promise<{
    uptime: import("@ing3kth/core/dist/interface/IMilliseconds").IMilliseconds_Part;
    status: number;
    ping: {
        data: {
            discordApi: number;
            client: number;
        };
        average: number;
    };
}>;
export default getStatus;
