interface IUpdate_Part {
    name: string;
    version: {
        current: string;
        latest: string;
    };
}
interface IUpdate {
    response: string;
    data: {
        update: Array<IUpdate_Part>;
        latest: Array<IUpdate_Part>;
    };
}
export type { IUpdate, IUpdate_Part };
//# sourceMappingURL=IUpdate.d.ts.map