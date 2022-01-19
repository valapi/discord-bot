const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('key')
        .setDescription('NOT RECOMMENDED - Save Your Private Key In Database')
        .addSubcommand(subcommand => 
            subcommand
                .setName('add')
                .setDescription("Add Your Private Key To Database")
                .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key'))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('get')
                .setDescription("Get Your Private Key.")
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription("Remove Your Private Key From Database.")
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('new')
                .setDescription("Create New Private Key")
        ),

    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });

            if (interaction.options.getSubcommand() === "add") {
                const _key = await interaction.options.getString("privatekey");
                if (_key == null) {
                    await interaction.editReply({
                        content: `Sorry, You Must Type Your Private Key`,
                        ephemeral: true
                    });
                }else {
                    let needed_json = await JSON.parse(fs.readFileSync("./data/json/key.json", "utf8"));
                    needed_json[interaction.user.id] = {
                        key: _key
                    };

                    fs.writeFile("./data/json/key.json", JSON.stringify(needed_json), (err) => {
                        if (err) console.error(err)
                    });

                    await interaction.editReply({
                        content: `Save Your Private Key In Database, \n__**Hacker Can Use Your Private Key To Get Username And Password From Database**__\n\nPrivate Key: **${_key}**`,
                        ephemeral: true
                    });
                }

            }else if (interaction.options.getSubcommand() === "get") {
                let needed_json = await JSON.parse(fs.readFileSync("./data/json/key.json", "utf8"));

                const account = needed_json[interaction.user.id];

                if(!account){
                    await interaction.editReply({
                        content: `Can't Find Your Private Key In Database`,
                        ephemeral: true
                    });
                }else{
                    await interaction.editReply({
                        content: `__**Hacker Can Use Your Private Key To Get Username And Password From Database**__\n\nPrivate Key: **${account.key}**`,
                        ephemeral: true
                    });
                }
            }else if (interaction.options.getSubcommand() === "remove") {
                let needed_json = await JSON.parse(fs.readFileSync("./data/json/key.json", "utf8"));

                const account = needed_json[interaction.user.id];

                if(!account){
                    await interaction.editReply({
                        content: `Can't Find Your Private Key In Database`,
                        ephemeral: true
                    });
                }else{
                    delete needed_json[interaction.user.id];

                    fs.writeFile("./data/json/key.json", JSON.stringify(needed_json), (err) => {
                        if (err) console.error(err)
                    });
                    
                    await interaction.editReply({
                        content: `Delete Your Private Key From Database.`,
                        ephemeral: true
                    });
                }
            }else if (interaction.options.getSubcommand() === "new") {
                var _key = await client.createSalt();

                await interaction.editReply({
                    content: `**" Keep It Secret "**\nAnd Saving Private Key At The Safest Spot !!!\n\nKey: **${_key}**`,
                    ephemeral: true
                });
            }
        } catch (err) {
            console.error(err);
        }
    }
}