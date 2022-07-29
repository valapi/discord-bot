//import

import type { IEventHandler } from "../modules";

import * as IngCore from "@ing3kth/core";

//script

const __event: IEventHandler.File<"error"> = {
    name: "error",
    once: false,
    async execute({ }, error) {
      IngCore.Logs.log(error, "error");
    },
};

//export

export default __event;