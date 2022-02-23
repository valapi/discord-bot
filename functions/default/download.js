const fs = require('fs');
const request = require('request');

module.exports = (client) => {
    client.download = async (uri, filename, callback) => {

        request.head(uri, async function (err, res, body) {
            const returnData = {
                'content-type': res.headers['content-type'],
                'content-length': res.headers['content-length']
            }

            await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);

            if(err){
                throw new Error(err);
            }else {
                return returnData;
            }
        });

    };
}