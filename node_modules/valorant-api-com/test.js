const Client = require('./src/valorant-api.js');

(async () => {

    let config = {
        'language': 'en-US'
    };

    let client = new Client(config); // Create a Client

    let allAgents = await client.getAgents() // request all agents data

    console.log(allAgents) // see all agents data in console log

})();