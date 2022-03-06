const mongoose = require(`mongoose`);
const { dbToken } = require(`./config.json`);

//connect

await mongoose.connect(dbToken, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// create

const valorantSchema = new mongoose.Schema({
    username: String,
    password: String,
    discordId: Number
})

const Account = mongoose.model('valorants', valorantSchema);

//save

const findAccount = new Account({ username: 'USERNAME', password: 'PASSWORD', discordId: 549231132382855189 });
findAccount.save().then(async () => {
    //message
});

//find

const user = await Account.findOne({ username: 'USERNAME' });
console.log(user);

//delete

const edelete = await Account.deleteOne({ username: 'USERNAME' });
console.log(edelete.deletedCount);