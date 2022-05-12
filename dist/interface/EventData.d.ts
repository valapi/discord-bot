import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { Client, Collection } from 'discord.js';
interface EventExtraData {
    client: Client;
    commands: Collection<any, any>;
    commandArray: Array<{
        data: RESTPostAPIApplicationCommandsJSONBody;
        execute: Function;
    }>;
}
export type { EventExtraData };
//# sourceMappingURL=EventData.d.ts.map