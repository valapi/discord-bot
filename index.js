const CryptoJS = require('crypto-js');
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');

// Create Client
const client = new Client(
    { intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES
        ] 
    }
);

client.commands = new Collection();

const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }

    // Login As Discord Bot
    client.handleEvents(eventFiles, './events');
    client.handleCommands(commandFolders, './commands');
    client.login(token);
    client.updateApi(client);

})();