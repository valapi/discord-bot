import { ClientEvents } from "discord.js";

export interface EventOption {
    once?: boolean;
}

export default class Event<T extends keyof ClientEvents = keyof ClientEvents> {
    public name: T;
    public callback: (...args: ClientEvents[T]) => Promise<void>;
    public option: Required<EventOption>;

    public constructor(name: T, callback: (...args: ClientEvents[T]) => Promise<void>, option?: EventOption) {
        this.name = name;
        this.callback = callback;
        this.option = {
            ...{
                once: false
            },
            ...option
        };
    }
}
