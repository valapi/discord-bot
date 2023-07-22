import { Events, PresenceUpdateStatus, ActivityType } from "discord.js";

import Event from "../core/event";

export default new Event(
    Events.ClientReady,
    async (client) => {
        console.log(`${client.user.tag} is online!`);

        client.user.setStatus(PresenceUpdateStatus.Online);

        client.user.setActivity({
            name: "ING PROJECT",
            type: ActivityType.Streaming
        });
    },
    {
        once: true
    }
);
