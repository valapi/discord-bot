/// import process from "node:process";
import os from "node:os";

import { open } from "lmdb";

import type { AuthCore } from "valorant.ts";

import config from "../data/config.json";

export default open<AuthCore.Json>({
    compression: true,
    dupSort: false,
    encoding: "json",
    name: config.databaseName,
    path: os.tmpdir()
});
