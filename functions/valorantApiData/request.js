const axios = require('axios');

module.exports = (client) => {
    client.request = async (url) => {
        try{
            var config = {
                method: `get`,
                url: url
            };
            
            const response = (await axios(config)).data;
            const data = await response.data;

            return {data: data, isError: false};
        }catch (err) {
            return {data: err, isError: true};
        } 
    };
}