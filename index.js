const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');
const { send } = require('process');
var CronJob = require('cron').CronJob;

// Create Client
const client = new Client(
    {
        intents: [
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
        await require(`./functions/${file}`)(client);
    }

    // Login As Discord Bot
    console.log(`----------------------------------------------------`);
    await client.dbLogin();
    await client.handleEvents(eventFiles, './events');
    await client.handleCommands(commandFolders, './commands');
    await client.login(token);
    await client.user.setActivity("ING PROJECT", { type: "PLAYING" });

    //set maxListeners Limit
    require('events').EventEmitter.defaultMaxListeners = 35;

    //update Client
    const popJob = new CronJob({
        cronTime: '0 0 8 * * *',
        onTick: async function () {
            await client.updateClient(client);
        },
        start: false,
        timeZone: 'Asia/Bangkok'
    });
    popJob.start();

})();