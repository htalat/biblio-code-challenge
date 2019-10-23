const mongoose = require('mongoose');
const config = require('./environment');
const connectionString = config.MONGO_CONNECTION;

exports.setup = () =>{

    let opts = {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
    mongoose.connect(connectionString, opts);
    mongoose.Promise = global.Promise;

    const db = mongoose.connection;
    db.on('error', (err) => console.error('MongoDB connection error:', err));
}