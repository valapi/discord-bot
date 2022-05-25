/**
 * EventEmitter
 */
declare class Event {
    private EventController;
    constructor();
    /**
     *
     * @param {String} name Name
     * @param {any} args Data
     */
    protected emit(name: string, ...args: Array<any>): void;
    /**
     *
     * @param {String} name Name
     * @param {Function} callback Call Back Function
     */
    off(name: string, callback?: Function): void;
    /**
     *
     * @param {String} name Name
     * @param {Function} callback Call Back Function
     */
    on(name: string, callback: Function): void;
    /**
     *
     * @param {String} name Name
     * @param {Function} callback Call Back Function
     */
    once(name: string, callback: Function): void;
}
export { Event };
//# sourceMappingURL=Event.d.ts.map