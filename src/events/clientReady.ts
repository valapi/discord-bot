import { Events } from "discord.js";

import Event from "../core/event";

export default new Event(
    Events.ClientReady,
    async (client) => {
        console.log(`${client.user.tag} is online!`);
    },
    {
        once: true
    }
);
