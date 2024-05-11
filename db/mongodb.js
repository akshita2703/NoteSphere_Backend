const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url).then(
    () => {
        console.log("sucessfully connected to DB");
    }).catch((err) =>{
        console.log("Error Connecting to the DB",err);
        process.exit(1);
    });
};

const disconnectDB = ()=>{
    mongoose.connection.close((err)=>{
        if(err){
            console.log('Error closing MongoDB connection:',err);
        }
        else{
            console.log('MongoDB connection closed sucessfully');
        }
    });
};

module.exports = {connectDB,disconnectDB};