const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getMatchDetails = async (Account, MatchID) => {
        try {
            const cookieJar = Account.request.cookie;
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const response = await axiosClient.get(Account.url.playerData + `/match-details/v1/matches/${MatchID}`, {
                headers: Account.request.headers
            });
            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}