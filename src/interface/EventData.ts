import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { Client, Collection } from 'discord.js';

interface EventExtraData {
    client: Client;
    commands: Collection<any, any>;
    commandArray: Array<RESTPostAPIApplicationCommandsJSONBody>;
}

export type { EventExtraData };