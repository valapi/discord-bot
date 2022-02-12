var nodemon = require('nodemon');
var process = require('process');

nodemon({script: 'index.js', ext: 'js'})
    .on('crash', async function () {
        await nodemon.emit('quit');
        try {
            await nodemon("--ignore /data/* -x 'node nodemon.js'");
        }catch(err){
            try {
                await nodemon.emit('quit');
                await nodemon.emit('quit');
                await nodemon("--ignore /data/* -x 'node nodemon.js'");
            }catch (err) {
                console.error(err);
                await process.exit()
            }
        }
});