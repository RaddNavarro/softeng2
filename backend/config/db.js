const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI')

// Connect to the Database
const connectDB = async () => {
    try {
        await mongoose.connect(db);

        console.log('MongoDB Connected...')
    } catch (error) {
        console.log(error.messaage);
        process.exit(1)
    }
}

module.exports = connectDB;