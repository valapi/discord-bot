const mongoose = require('mongoose');
const { dbToken } = require('../../config.json');
const fs = require('fs');

module.exports = (client) => {
    client.dbLogin = async () => {
        try {
            const mongoEventFiles = await fs.readdirSync('./mongoEvents').filter(file => file.endsWith('.js'));
            for (file of mongoEventFiles) {
                const event = require(`../../mongoEvents/${file}`);
                if (event.once) {
                    mongoose.connection.once(event.name, (...args) => event.execute(...args));
                } else {
                    mongoose.connection.on(event.name, (...args) => event.execute(...args));
                }
            }
            mongoose.Promise = global.Promise;
            await mongoose.connect(dbToken, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        } catch (error) {
            console.error(error)
        }
    };
}