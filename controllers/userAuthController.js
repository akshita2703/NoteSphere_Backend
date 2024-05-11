const { statusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const User = require('./../model/user');


dotenv.config();
const secretKey = process.env.SECRET_KEY;

const securePassword = async (password) => {
    try {
        let hashedPass = await bcrypt.hash(password, 10);
        return hashedPass;
    } catch (err) {
        console.log(`Error Hashing password `, err);
        process.exit(1);
    }
}

// register user -- signup 
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const responseobj = {
            isVerified: false,
            msg: 'default-res-obj-msg'
        };
        console.log(responseobj);
        // check for null 
        if (!name || !email || !password) {
            responseobj.msg = 'Please fill all the fields';
            return res.status(400).json(responseobj);
        }
        console.log(req.body);
        // check if email already exist
        const olduser = await User.findOne({ email });
        console.log(olduser);
        if (olduser) {
            console.log(olduser);
            responseobj.msg = `User with email ${olduser.email} already exit.`;
            return res.status(200).send(responseobj);
        }
        console.log(olduser);
        // created hash password 
        const hashedPass = await securePassword(password);
        console.log(hashedPass);

        // create Entry data
        const newData = { name, email, password: hashedPass };
        console.log(newData);

        // Create User in DB
        const newuser = await User.create({ ...newData });
        console.log(newuser);

        console.log("m1");

        // Generate Access Token 
        const accessToken = await newuser.generateAccessToken(secretKey);
        console.log(accessToken);
        console.log("m2");

        responseobj.isVerified = true;
        responseobj.accessToken = accessToken;
        responseobj.msg = `Registered Sucessfully`;
        
        return res.status(200).json(responseobj);
    } catch (err) {
        console.log("Error registering a new user", err);
        process.exit(1);

    }
};

const login = async (req, res) => {
    try {
        const{email,password} = req.body;

        const responseobj =  {
            isVerified: false,
            msg: 'default-res-obj-msg',
            token: null
        };
        if(!email||!password){
        
            responseobj.msg = 'Please fill all the fields';
            return res.status(400).json(responseobj);
        }
        // check if email already exist
        const olduser = await User.findOne({email})
        if(olduser){
            const isPassword = await bcrypt.compare(password,olduser.password);
            if(isPassword){
                responseobj.msg = 'user is verified';
                responseobj.isVerified = true;
                responseobj.token = olduser.generateAccessToken(secretKey);

                return res.status(200).json(responseobj);

            } else{
                responseobj.msg = 'password is incorrect';
                return res.status(400).json(responseobj);
            }

        }
        else{
            responseobj.msg = 'Email does not exit';
            return res.status(400).json(responseobj);

        }
        

    } catch (err) {
         console.log("Error login  user", err);
        process.exit(1);


    }
}

module.exports = { signup, login }; 