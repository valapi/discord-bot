const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getPlayerMMR = async (Account, puuid = null) => {
        try {
            const cookieJar = Account.request.cookie;
            const axiosClient = wrapper(axios.create({ cookieJar }));

            var response;
            if(puuid == null){
                response = await axiosClient.get(Account.url.playerData + `/mmr/v1/players/${Account.user.id}/`, {
                    headers: Account.request.headers
                });
            }else {
                response = await axiosClient.get(Account.url.playerData + `/mmr/v1/players/${puuid}/`, {
                    headers: Account.request.headers
                });
            }

            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}