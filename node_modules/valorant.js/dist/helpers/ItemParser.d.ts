export declare class ItemParser {
    data: any;
    /**
     * Parses the valorant storefront item's
     * @param data {object} Data to parse
     * @returns {object} parsed data
     */
    constructor(data: any);
    parse(): {
        characters: any[];
        maps: any[];
        chromas: any[];
        skins: any[];
        skinLevels: any[];
        attachments: any[];
        equips: any[];
        themes: any[];
        gamemodes: any[];
        sprays: any[];
        sprayLevels: any[];
        charms: any[];
        charmLevels: any[];
        playerCards: any[];
        playerTitles: any[];
        storefrontItems: any[];
    } | {
        Subject: any;
        Version: any;
        GunSkins: {};
        Sprays: {};
        Identity: any;
    };
}
