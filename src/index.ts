// import

import express from "express";
import * as IngCore from "@ing3kth/core";
import logger from "./utils/logger";

import { StartDiscordBot } from "./app";

// script

const PORT = Math.floor(IngCore.random(3000, 4000));
const app = express();

app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send(
        JSON.stringify({
            uptime: IngCore.Milliseconds.toJson(process.uptime() * 1000)
        })
    );

    next;
});

app.listen(PORT, () => {
    logger.info(`Server is running on PORT ${PORT}`);
});

(async () => {
    const _DevelopmentMode = true;

    await StartDiscordBot(_DevelopmentMode);
})();
