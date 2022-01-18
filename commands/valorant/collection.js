const { SlashCommandBuilder } = require('@discordjs/builders');
const { RiotApiClient, Region } = require("valorant.js");
const valorantApiCom = require('valorant-api-com');
const fs = require('fs');
const console = require('console');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collection')
        .setDescription('Get My Valorant Items Collection')
        .addSubcommand(subcommand =>
            subcommand
                .setName('weapon')
                .setDescription("Add Your Private Key To Database")
                .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sprays')
                .setDescription("Add Your Private Key To Database")
                .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('more')
                .setDescription("Add Your Private Key To Database")
                .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key'))
        ),

    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });

            const riot_json = JSON.parse(fs.readFileSync("./data/json/account.json", "utf8"));
            const riot_api = riot_json[interaction.user.id];

            const _key = interaction.options.getString("privatekey");

            if (_key == null) {
                await interaction.editReply({
                    content: `Sorry, You Must Type Your Private Key`,
                    ephemeral: true
                });
            } else {
                var _name = await client.decryptBack(riot_api.name, _key);
                var _password = await client.decryptBack(riot_api.password, _key);

                const riotApi = new RiotApiClient({
                    username: _name, // your username
                    password: _password, // your password
                    region: Region.AP // Available regions: EU, NA, AP
                });

                await riotApi.login();

                const accountId = riotApi.user.Subject;
                const collection = await riotApi.playerApi.getInventory(accountId);
                let valorantApi = new valorantApiCom({
                    'language': 'en-US'
                });

                if (interaction.options.getSubcommand() === "weapon") {
                    let getWeapons = await valorantApi.getWeaponSkins()

                    const skin_odin = collection.GunSkins.Odin;
                    const skin_ares = collection.GunSkins.Ares;
                    const skin_vandal = collection.GunSkins.Vandal;
                    const skin_bulldog = collection.GunSkins.Bulldog;
                    const skin_phantom = collection.GunSkins.Phantom;
                    const skin_judge = collection.GunSkins.Judge;
                    const skin_bucky = collection.GunSkins.Bucky;
                    const skin_frenzy = collection.GunSkins.Frenzy;
                    const skin_classic = collection.GunSkins.Classic;
                    const skin_ghost = collection.GunSkins.Ghost;
                    const skin_sheriff = collection.GunSkins.Sheriff;
                    const skin_shorty = collection.GunSkins.Shorty;
                    const skin_operator = collection.GunSkins.Operator;
                    const skin_guardian = collection.GunSkins.Guardian;
                    const skin_marshal = collection.GunSkins.Marshal;
                    const skin_spectre = collection.GunSkins.Spectre;
                    const skin_stinger = collection.GunSkins.Stinger;
                    const skin_melee = collection.GunSkins.Melee;

                    let name_odin = "";
                    let name_ares = "";
                    let name_vandal = "";
                    let name_bulldog = "";
                    let name_phantom = "";
                    let name_judge = "";
                    let name_bucky = "";
                    let name_frenzy = "";
                    let name_classic = "";
                    let name_ghost = "";
                    let name_sheriff = "";
                    let name_shorty = "";
                    let name_operator = "";
                    let name_guardian = "";
                    let name_marshal = "";
                    let name_spectre = "";
                    let name_stinger = "";
                    let name_melee = "";

                    for (let i = 0; i < getWeapons.data.length; i++) {
                        if (getWeapons.data[i].uuid === skin_odin) {
                            name_odin += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_ares) {
                            name_ares += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_vandal) {
                            name_vandal += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_bulldog) {
                            name_bulldog += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_phantom) {
                            name_phantom += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_judge) {
                            name_judge += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_bucky) {
                            name_bucky += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_frenzy) {
                            name_frenzy += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_classic) {
                            name_classic += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_ghost) {
                            name_ghost += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_sheriff) {
                            name_sheriff += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_shorty) {
                            name_shorty += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_operator) {
                            name_operator += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_guardian) {
                            name_guardian += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_marshal) {
                            name_marshal += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_spectre) {
                            name_spectre += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_stinger) {
                            name_stinger += getWeapons.data[i].displayName;

                        } else if (getWeapons.data[i].uuid === skin_melee) {
                            name_melee += getWeapons.data[i].displayName;

                        }
                    }

                    await interaction.editReply({
                        content: `Classic: **${name_classic}**\nShorty: **${name_shorty}**\nFrenzy: **${name_frenzy}**\nGhost: **${name_ghost}**\nSheriff: **${name_sheriff}**\nStinger: **${name_stinger}**\nSpectre: **${name_spectre}**\nBucky: **${name_bucky}**\nJudge: **${name_judge}**\nBulldog: **${name_bulldog}**\nGuardian: **${name_guardian}**\nPhantom: **${name_phantom}**\nVandal: **${name_vandal}**\nMarshal: **${name_marshal}**\nOperator: **${name_operator}**\nAres: **${name_ares}**\nOdin: **${name_odin}**\nMelee: **${name_melee}**`,
                        ephemeral: true
                    });

                } else if (interaction.options.getSubcommand() === "sprays") {
                    let getSprays = await valorantApi.getSprays()

                    const spary_pre = collection.Sprays.PreRound;
                    const spary_mid = collection.Sprays.MidRound;
                    const spary_post = collection.Sprays.PostRound;

                    let name_pre = "";
                    let name_mid = "";
                    let name_post = "";

                    for (let i = 0; i < getSprays.data.length; i++) {
                        if (getSprays.data[i].uuid === spary_pre) {
                            name_pre += getSprays.data[i].displayName;

                        } else if (getSprays.data[i].uuid === spary_mid) {
                            name_mid += getSprays.data[i].displayName;

                        } else if (getSprays.data[i].uuid === spary_post) {
                            name_post += getSprays.data[i].displayName;

                        }
                    }

                    await interaction.editReply({
                        content: `Pre Round: **${name_pre}**\nMid Round: **${name_mid}**\nPost Round: **${name_post}**`,
                        ephemeral: true
                    });
                } else if (interaction.options.getSubcommand() === "more") {
                    const getCard = await valorantApi.getPlayerCards()
                    const getTitile = await valorantApi.getPlayerTitles()

                    const identity_card = collection.Identity.PlayerCardID;
                    const identity_title = collection.Identity.PlayerTitleID;

                    let name_card = "";
                    let name_title = "";

                    for (let i = 0; i < getCard.data.length; i++) {
                        if (getCard.data[i].uuid === identity_card) {
                            name_card += getCard.data[i].displayName;
                        }
                    }

                    for (let i = 0; i < getTitile.data.length; i++) {
                        if (getTitile.data[i].uuid === identity_title) {
                            name_title += getTitile.data[i].displayName;
                        }
                    }

                    await interaction.editReply({
                        content: `Player Card: **${name_card}**\nPlayer Title: **${name_title}**`,
                        ephemeral: true
                    });
                }
            }

        } catch (err) {
            console.error(err);
        }
    }
}