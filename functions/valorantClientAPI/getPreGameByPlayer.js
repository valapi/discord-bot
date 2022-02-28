const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getPreGameByPlayer = async (Account) => {
        try {
            const cookieJar = Account.request.cookie;
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const responseByPlayer = await axiosClient.get(Account.url.partyService + `/pregame/v1/players/${Account.user.id}`, {
                headers: Account.request.headers
            });

            const MatchId = responseByPlayer.data.MatchID;

            const response = await axiosClient.get(Account.url.partyService + `/pregame/v1/matches/${MatchId}`, {
                headers: Account.request.headers
            });

            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}