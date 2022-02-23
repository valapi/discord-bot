const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getMatchHistory = async (Account, startIndex, endIndex) => {
        try {
            const cookieJar = new tough.CookieJar();
            const axiosClient = wrapper(axios.create({ cookieJar }));

            var response;
            if(!startIndex && !endIndex){
                response = await axiosClient.get(Account.url.playerData + `/match-history/v1/history/${Account.user.id}`, {
                    headers: Account.request.headers
                });
            }else {
                const _startIndex = startIndex + 0;
                const _endIndex = endIndex + 0;

                response = await axiosClient.get(Account.url.playerData + `/match-history/v1/history/${Account.user.id}?startIndex=${_startIndex}&endIndex=${_endIndex}`, {
                    headers: Account.request.headers
                });
            }
            return {data: response.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}