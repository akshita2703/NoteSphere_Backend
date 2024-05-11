// Import Libraries
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRouter = require('./routes/userAuthRouter.js');
const noteRouter = require('./routes/noteRouter.js');

// Import Modules
const {connectDB, disconnectDB} = require('./db/mongodb.js');
const authenticate = require('./middlewares/authenticate.js');

dotenv.config();
const port = process.env.PORT || 5500;
const mongoURI = process.env.MONGO_URI;
const live = process.env.LIVE;

// get an instance of express
const app = express();

app.use(cors());
app.use(express.json()); 
// app.use(express.static(publicDirectoryPath,'index.html'));

// Serve the root
app.get('/', (req, res) => {
    res.status(200).send('Hello');
});

app.use('/user/auth', authRouter);
app.use('/note',authenticate,noteRouter);
// Middlewares


const start = async () =>{
    try {
        if(!mongoURI){ 
            console.error('MONGO_URI enviroment variable is not set.');
            process.exit(1);
        }
        await connectDB(mongoURI);
        app.listen(port,()=>{
            console.log(`server is listening to port ${port} happily `);
            console.log(`Go Live: ${live}${port}/`)
        });
        
    } catch (error) {
        console.error('Error starting the server:',error);
        process.exit(1);
    }
};

start();

process.on('SIGINT', () => {
    console.log('Shutting down gracefully');

    try {
        disconnectDB();
    } catch (err) {
        console.log("Error disconnecting mongoDB", err);
    }

    process.exit(0);
});