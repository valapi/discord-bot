// import

import type { IEventHandler } from "../modules";

import logger from "../utils/logger";

// script

const __event: IEventHandler.File<"ready"> = {
    name: "ready",
    once: true,
    async execute({}, client) {
        logger.info(`Ready! Logged in as ${client.user.tag}`);
    }
};

// export

export default __event;
