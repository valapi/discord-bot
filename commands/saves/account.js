const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Manage Valorant Account')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add Your Valorant Account To Database")
                .addStringOption(option =>
                    option
                        .setName('username')
                        .setDescription('Type Your Riot Account Username')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('password')
                        .setDescription('Type Your Riot Account Password')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('privatekey')
                        .setDescription('Type Your Private Key')
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('mfa')
                .setDescription("Get Your Valorant Account From Database")
                .addNumberOption(option =>
                    option
                        .setName('code')
                        .setDescription('Type Your Verify Code')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('privatekey')
                        .setDescription('Type Your Private Key')
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription("Get Your Valorant Account From Database")
                .addStringOption(option =>
                    option
                        .setName('privatekey')
                        .setDescription('Type Your Private Key')
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription("Remove Your Valorant Account From Database")
        ),

    async execute(interaction, client, createdTime) {
        try {
            if (interaction.options.getSubcommand() === "add") {
                const _user = await interaction.options.getString("username");
                const _pass = await interaction.options.getString("password");
                var _key = await interaction.options.getString("privatekey");

                if (_user == null || _pass == null) {
                    await interaction.editReply({
                        content: `Something Went Wrong, Please Try Again Later`,
                        ephemeral: true
                    });
                } else {
                    if (_key == null) {
                        //try to find key in database
                        var tryToFindKey;
                        try {
                            const keySchema = new mongoose.Schema({
                                key: String,
                                discordId: Number
                            })

                            tryToFindKey = await mongoose.model('keys', keySchema);
                        } catch (err) {
                            tryToFindKey = await mongoose.model('keys');
                        }
                        getKeyUser = await tryToFindKey.findOne({ discordId: await interaction.user.id });
                        if (getKeyUser || getKeyUser != null || getKeyUser != undefined) {
                            _key = await getKeyUser.key;
                        }
                    }

                    if (_key == null) {
                        await interaction.editReply({
                            content: `Sorry, You Must Type Your Private Key`,
                            ephemeral: true
                        });
                    } else {
                        const _username = await client.encryptTo(_user, _key);
                        const _password = await client.encryptTo(_pass, _key);

                        //check
                        const ValorantAccount = await client.valorantClientAPI(_user, _pass);
                        if (ValorantAccount.isError) {
                            await interaction.editReply({
                                content: `**Username or Password Is Wrong,**\nSomething Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                        } else {
                            if (ValorantAccount.data.type == 'multifactor') {
                                await interaction.editReply({
                                    content: `**Riot Will Send You Verify Code In Your Mail,**\nThen Type The Code In __**/account mfa**__\n\nIf You Don't Get The Code, Please Try Again Later`,
                                    ephemeral: true
                                });
                                //save cookie
                                let needed_json = await JSON.parse(fs.readFileSync("./data/json/mfa.json", "utf8"));
                                needed_json[interaction.user.id] = ValorantAccount.request.cookie;

                                fs.writeFile("./data/json/mfa.json", JSON.stringify(needed_json), (err) => {
                                    if (err) console.error(err)
                                });
                                //wait 5 minutes then remove cookie (timeout)
                                await client.wait(100);
                                await delete needed_json[interaction.user.id];
                                await fs.writeFile("./data/json/mfa.json", JSON.stringify(needed_json), (err) => {
                                    if (err) console.error(err)
                                });
                            } else {
                                //save account
                                await client.dbLogin().then(async () => {
                                    // create
                                    const valorantSchema = new mongoose.Schema({
                                        username: String,
                                        password: String,
                                        discordId: Number
                                    })

                                    var Account;
                                    try {
                                        Account = await mongoose.model('valorants', valorantSchema);
                                    } catch (err) {
                                        Account = await mongoose.model('valorants');
                                    }
                                    const user = await Account.findOne({ discordId: await interaction.user.id });
                                    if (user != null) {
                                        //delete 
                                        await Account.deleteOne({ discordId: await interaction.user.id });
                                    }

                                    const findAccount = await new Account({ username: _username, password: _password, discordId: await interaction.user.id });
                                    findAccount.save().then(async () => {
                                        const createEmbed = new MessageEmbed()
                                            .setColor(`#0099ff`)
                                            .setTitle(`/${await interaction.commandName} ${await interaction.options.getSubcommand()}`)
                                            .setURL(`https://ingkth.wordpress.com`)
                                            .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                            .setDescription(`Name: **${await client.decryptBack(_username, _key)}**\nPassword: **${await client.decryptBack(_password, _key)}**\nPrivate Key: **${_key}**`)
                                            .setTimestamp(createdTime)
                                            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                        await interaction.editReply({
                                            content: `Register Riot Account With`,
                                            embeds: [createEmbed],
                                            ephemeral: true
                                        });
                                    });
                                });
                            }
                        }
                    }
                }
            } else if (interaction.options.getSubcommand() === "mfa") {
                var _key = await interaction.options.getString("privatekey");
                await client.dbLogin().then(async () => {
                    var Account;
                    try {
                        const valorantSchema = new mongoose.Schema({
                            username: String,
                            password: String,
                            discordId: Number
                        })

                        Account = await mongoose.model('valorants', valorantSchema);
                    } catch (err) {
                        Account = await mongoose.model('valorants');
                    }
                    //script
                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Account In Database`,
                            ephemeral: true
                        });
                    } else {
                        if (_key == null) {
                            //try to find key in database
                            var tryToFindKey;
                            try {
                                const keySchema = new mongoose.Schema({
                                    key: String,
                                    discordId: Number
                                })

                                tryToFindKey = await mongoose.model('keys', keySchema);
                            } catch (err) {
                                tryToFindKey = await mongoose.model('keys');
                            }
                            const getKeyUser = await tryToFindKey.findOne({ discordId: await interaction.user.id });
                            if (getKeyUser || getKeyUser != null || getKeyUser != undefined) {
                                _key = await getKeyUser.key;
                            }
                        }

                        if (_key == null) {
                            await interaction.editReply({
                                content: `Sorry, You Must Type Your Private Key`,
                                ephemeral: true
                            });
                        } else {
                            //get cookie
                            let needed_json = await JSON.parse(fs.readFileSync("./data/json/mfa.json", "utf8"));
                            const _cookie = needed_json[interaction.user.id];

                            if (!_cookie) {
                                await interaction.editReply({
                                    content: `**Please Use __" /account add "__ First**\nSomething Went Wrong, Please Try Again Later`,
                                    ephemeral: true
                                });
                            } else {
                                //client
                                const _code = await interaction.options.getNumber("code");
                                const ValorantAccount = await client.twofactor(_cookie, _code);
                                if (ValorantAccount.isError) {
                                    await interaction.editReply({
                                        content: `**Verify Code Is Wrong,**\nSomething Went Wrong, Please Try Again Later`,
                                        ephemeral: true
                                    });
                                }else {
                                    if(ValorantAccount.request.accessToken){
                                        await interaction.editReply({
                                            content: `**Sorry, This Bot Is Not Support Two Factor Authentication**\n\nTurn Off Your MFA Or Waiting Until Support`,
                                            ephemeral: true
                                        });
                                    }else {
                                        await interaction.editReply({
                                            content: `Something Went Wrong, Please Try Again Later`,
                                            ephemeral: true
                                        });
                                    }

                                    //remove cookie
                                    delete needed_json[interaction.user.id];
                                    fs.writeFile("./data/json/mfa.json", JSON.stringify(needed_json), (err) => {
                                        if (err) console.error(err)
                                    });
                                }
                            }
                        }
                    }
                });
            } else if (interaction.options.getSubcommand() === "get") {
                var _key = await interaction.options.getString("privatekey");
                await client.dbLogin().then(async () => {
                    var Account;
                    try {
                        const valorantSchema = new mongoose.Schema({
                            username: String,
                            password: String,
                            discordId: Number
                        })

                        Account = await mongoose.model('valorants', valorantSchema);
                    } catch (err) {
                        Account = await mongoose.model('valorants');
                    }
                    //script
                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Account In Database`,
                            ephemeral: true
                        });
                    } else {
                        if (_key == null) {
                            //try to find key in database
                            var tryToFindKey;
                            try {
                                const keySchema = new mongoose.Schema({
                                    key: String,
                                    discordId: Number
                                })

                                tryToFindKey = await mongoose.model('keys', keySchema);
                            } catch (err) {
                                tryToFindKey = await mongoose.model('keys');
                            }
                            const getKeyUser = await tryToFindKey.findOne({ discordId: await interaction.user.id });
                            if (getKeyUser || getKeyUser != null || getKeyUser != undefined) {
                                _key = await getKeyUser.key;
                            }
                        }

                        if (_key == null) {
                            await interaction.editReply({
                                content: `Sorry, You Must Type Your Private Key`,
                                ephemeral: true
                            });
                        } else {
                            const _name = await client.decryptBack(await user.username, _key);
                            const _password = await client.decryptBack(await user.password, _key);

                            //client
                            const ValorantAccount = await client.valorantClientAPI(_name, _password);
                            const ValorantUser = await client.getUsernameFromID(ValorantAccount)
                            const ValorantInventory = await client.getPlayerInventory(ValorantAccount)

                            //player card
                            const ValorantPlayerCard_ID = await ValorantInventory.data.Identity.PlayerCardID
                            const getCards = await client.getPlayerCards(await ValorantPlayerCard_ID)
                            const ValorantPlayerCard_Display = await getCards.data.displayIcon;  //".wideArt"  //".largeArt"  //".displayIcon"  //".smallArt"

                            //sendMessage
                            let sendMessage = "";
                            sendMessage += `Name: **${ValorantUser.data[0].GameName}**\n`;
                            sendMessage += `Tag: **${ValorantUser.data[0].TagLine}**\n`;
                            sendMessage += `ID: **${ValorantAccount.user.id}**\n`;

                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(ValorantAccount.user.username)
                                .setURL(`https://ingkth.wordpress.com`)
                                .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                .setDescription(sendMessage)
                                .setThumbnail(ValorantPlayerCard_Display)
                                .setTimestamp(createdTime)
                                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                            await interaction.editReply({
                                content: `You Are Register Riot Account With`,
                                embeds: [createEmbed],
                                ephemeral: true
                            });
                        }
                    }
                });
            } else if (interaction.options.getSubcommand() === "remove") {
                await client.dbLogin().then(async () => {
                    // create
                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })

                    var Account;
                    try {
                        Account = await mongoose.model('valorants', valorantSchema);
                    } catch (err) {
                        Account = await mongoose.model('valorants');
                    }
                    const user = await Account.findOne({ discordId: await interaction.user.id });
                    if (user == null) {
                        await interaction.editReply({
                            content: `Can't Find Your Account In Database`,
                            ephemeral: true
                        });
                    } else {
                        //delete 
                        await Account.deleteOne({ discordId: await interaction.user.id });
                        //send message
                        await interaction.editReply({
                            content: `Remove Your Account From Database`,
                            ephemeral: true
                        });
                    }
                });
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
                ephemeral: true
            });
        }
    }
}