# Fortnite Manager

A library to interact with valorant-api
Api Wrapper for Valorant-Api.com

## Installation
```
npm i valorant-api-com
```

## How to Use?
Example:
```javascript
const Client = require('valorant-api-com');

(async () => {

    let config = {
        'language': 'en-US'
    };

    let client = new Client(config); // Create a Client

    let allAgents = await client.getAgents() // request all agents data

    console.log(allAgents) // see all agents data in console log

})();
```

# Documentation

## Client
```javascript
const Client = require('valorant-api-com')
const client = new Client(config) // config is optional
```

### Client Properties
- language

### Client Methods
- request(endpoint)
Make a Custom Request to Valorant-Api
- getAgents(uuid)
Get All Valorant Agents Data or a Particular Agent Data by UUID
- getBuddies(uuid)
Get All Valorant Weapon Buddies Data or a Particular Weapon Buddy Data by UUID
- getBundles(uuid)
Get All Valorant Bundles Data and Assets or Particular Bundle Data by UUID
- contentTiers(uuid)
Get All Valorant Content-Tiers Data or Particular Content-Tier Data by UUID
- getCurrency(uuid)
Get All Valorant Currencies Data or a Currency Data by UUID
- gamemodes(uuid)
Get All Valorant Gamemodes or a Gamemode Data by UUID
- equippables(uuid)
Get All Valorant Gamemode Equippables or an Equippable Data by UUID
- maps(uuid)
Get All Valorant Maps Data or a Map Data by UUID
- getPlayerCards(uuid)
Get All Players Cards Data or a Player Card by UUID
- getPlayerTitles(uuid)
Get All Players Titles Data or a Player Title by UUID
- getSeasons(uuid)
Get All Seasons Data or a Season Data by UUID
- getSprays(uuid)
Get All Sprays Data or a Spray Data by UUID
- getThemes(uuid)
Get All Themes Data or a Theme Data by UUID
- getWeapons(uuid)
Get All Weapons Data or a Weapon Data by UUID
- getVersion
Get Current Version Api is Running on

# Help
Feel free to join [our Discord server](https://fishstickbot.com/discord) to give Suggestions or for Help.

# Other Projects
You guys can check out my other projects:
1) [Fortnite Api Manager](https://www.npmjs.com/package/fortnite-api-manager)
2) [Fishstick Bot](https://fishstickbot.com/discord)

# License
MIT License

Copyright (c) 2021 Vanxh.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.