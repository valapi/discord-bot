import type { ModalSubmitInteraction } from "discord-modals";
import type { EventExtraData } from "../interface/EventData";
declare const _default: {
    name: string;
    once: boolean;
    execute(modal: ModalSubmitInteraction, _extraData: EventExtraData): Promise<void>;
};
export default _default;
