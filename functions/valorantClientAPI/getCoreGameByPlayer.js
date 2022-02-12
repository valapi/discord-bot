const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getCoreGameByPlayer = async (Account) => {
        try {
            const cookieJar = new tough.CookieJar();
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const responseByPlayer = await axiosClient.get(Account.url.partyService + `/core-game/v1/players/${Account.user.id}`, {
                headers: Account.requestHeaders
            });

            const MatchId = responseByPlayer.data.MatchID;

            const response = await axiosClient.get(Account.url.partyService + `/core-game/v1/matches/${MatchId}`, {
                headers: Account.requestHeaders
            });

            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}