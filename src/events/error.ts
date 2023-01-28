// import

import type { IEventHandler } from "../modules";

import logger from "../utils/logger";

// script

const __event: IEventHandler.File<"error"> = {
    name: "error",
    once: false,
    async execute({}, error) {
        logger.error(error);
    }
};

// export

export default __event;
