//import

import express from "express";
import * as IngCore from "@ing3kth/core";

import { StartDiscordBot } from "./app";

//script

const PORT = IngCore.Random(3000, 4000);
const app = express();

app.get("/", ((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send(
        JSON.stringify({
            uptime: IngCore.ToMilliseconds(process.uptime() * 1000),
        })
    );
}));

app.listen(PORT, (() => {
    IngCore.Logs.log(`Server is running on PORT ${PORT}`);
}));

(async () => {
    const _DevelopmentMode = false;

    await StartDiscordBot(_DevelopmentMode);
})();