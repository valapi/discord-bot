//import

import type { IEventHandler } from "../modules";

import * as IngCore from '@ing3kth/core';

//script

const __event: IEventHandler.File<'ready'> = {
    name: 'ready',
    once: true,
    async execute({ }, client) {
        IngCore.Logs.log(`Ready! Logged in as ${client.user.tag}`, 'system');
    },
};

//export

export default __event;