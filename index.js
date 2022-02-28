const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');
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

const functionFolders = fs.readdirSync('./functions')
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');

(async () => {
    //handleFunctions
    for (const folder of functionFolders) {
        const functionsFiles = fs.readdirSync(`./functions/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of functionsFiles) {
            await require(`./functions/${folder}/${file}`)(client);
        }
    }

    const ValorantAccount = await client.valorantClientAPI("KawinThailand", "kawinth0808");
    // console.log(ValorantAccount);

    const _codeMe = 869950

    const ValorantAccount2 = await client.twofactor(ValorantAccount, _codeMe);
    console.log(ValorantAccount2);

    // Login As Discord Bot
    console.log(`----------------------------------------------------`);
    await client.dbLogin();
    await client.wait(3);
    await client.handleEvents(eventFiles);
    await client.handleCommands(commandFolders, './commands');
    await client.wait(1);
    await client.login(token);
    await client.wait(3);
    await client.user.setActivity("ING PROJECT", { type: "PLAYING" });

    //set maxListeners Limit
    require('events').EventEmitter.defaultMaxListeners = 35;

    //update Client
    const popJob = new CronJob({
        cronTime: '0 0 8 * * *',
        onTick: async function () {
            try {
                await client.updateClient(client);
            } catch (err) {
                await client.wait(1);
                console.log(err);
            }
        },
        start: false,
        timeZone: 'Asia/Bangkok'
    });
    popJob.start();
})();