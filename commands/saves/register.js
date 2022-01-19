const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register Any Account')
        .addSubcommand(subcommand =>
            subcommand
                .setName('valorant')
                .setDescription("Add Your Valorant Account To Database")
                .addStringOption(option => option.setName('username').setDescription('Type Your Riot Account Username'))
                .addStringOption(option => option.setName('password').setDescription('Type Your Riot Account Password'))
                .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key')),
        ),

    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Loading Message.. ",
                ephemeral: true
            });

            if (interaction.options.getSubcommand() === "valorant") {
                const riot_user = await interaction.options.getString("username");
                const riot_password = await interaction.options.getString("password");
                const _key = await interaction.options.getString("privatekey");
                
                if (riot_user == null || riot_password == null || _key == null) {
                    await interaction.editReply({
                        content: `Sorry, You Must Type Your Username, Password And Private Key`,
                        ephemeral: true
                    });
                }else{
                    var _name = await client.encryptTo(riot_user, _key);
                    var _password = await client.encryptTo(riot_password, _key);
            
                    //create database
                    let needed_json = await JSON.parse(fs.readFileSync("./data/json/account.json", "utf8"));
                    needed_json[interaction.user.id] = {
                        name: _name,
                        password: _password
                    };
    
                    fs.writeFile("./data/json/account.json", JSON.stringify(needed_json), (err) => {
                        if (err) console.error(err)
                    });
        
                    await interaction.editReply({
                        content: `Register Riot Account With\n\nName: **${riot_user}**\nPassword: **${riot_password}**`,
                        ephemeral: true
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}