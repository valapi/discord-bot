const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, guild_id, client_id } = require('../../config.json');
const rest = new REST({ version: '9' }).setToken(token);
const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

             for (const file of commandFiles) {
                 const command = require(`../../commands/${folder}/${file}`);
                 client.commands.set(command.data.name, command);
                 client.commandArray.push(command.data.toJSON());
             }
        }

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    //Routes.applicationGuildCommands(client_id, guild_id),
                    Routes.applicationCommands(client_id),
                    { body: client.commandArray },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }
}