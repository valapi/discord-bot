var nodemon = require('nodemon');

nodemon({script: 'index.js', ext: 'js'})
    .on('crash', async function () {
        await nodemon.emit('quit');
        await nodemon("--ignore /data/json/gmail.json -x 'node nodemon.js'");
});