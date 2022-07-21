//import

import { ClientEvents } from 'discord.js';

//interface

namespace IEventHandler {
    export interface File<Event extends keyof ClientEvents> {
        name: Event;
        once: boolean;
        execute: (...args: ClientEvents[Event]) => Promise<any>;
    }
}

//export

export type {
    IEventHandler
};