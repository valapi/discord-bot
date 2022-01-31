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

const findAccount = new Account({ username: 'KawinThailand', password: 'kawinth0808', discordId: 549231132382855189 });
findAccount.save().then(async () => {
    //message
});

//find

const user = await Account.findOne({ username: 'KawinThailand' });
console.log(user);

//delete 
const edelete = await Account.deleteOne({ username: 'KawinThailand' });
console.log(edelete.deletedCount);