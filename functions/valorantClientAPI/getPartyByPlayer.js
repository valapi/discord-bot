const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support')
const tough = require('tough-cookie');

module.exports = (client) => {
    client.getPartyByPlayer = async (Account) => {
        try {
            const cookieJar = new tough.CookieJar();
            const axiosClient = wrapper(axios.create({ cookieJar }));

            const responseByPlayer = await axiosClient.get(Account.url.partyService + `/parties/v1/players/${Account.user.id}`,{
                headers: Account.request.headers
            });

            const partyId = responseByPlayer.data.CurrentPartyID;
            const responseById = await axiosClient.get(Account.url.partyService + `/parties/v1/parties/${partyId}`,{
                headers: Account.request.headers,
            });

            return {data: responseById.data, isError: false};
        }catch(err){
            return {data: err, isError: true};
        }
    };
}