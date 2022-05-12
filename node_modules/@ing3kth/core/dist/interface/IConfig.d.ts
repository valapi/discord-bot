interface IConfig_File {
    "path": string;
    "extension": string;
}
interface IConfig {
    "create": Date | string;
    "version": number;
    "logs": {
        "save": boolean;
        "show": boolean;
        "file": IConfig_File;
    };
    "cache": {
        "file": IConfig_File;
    };
    "val-api": {
        "RiotLocal": {
            "ip": string;
            "username": string;
            "lockfile": string;
        };
        "ValClient": {
            "auth": {
                "User-Agent": string;
            };
            "client": {
                "version": string;
                "platform": {
                    "platformType": string;
                    "platformOS": string;
                    "platformOSVersion": string;
                    "platformChipset": string;
                };
            };
        };
    };
}
export type { IConfig, IConfig_File };
//# sourceMappingURL=IConfig.d.ts.map