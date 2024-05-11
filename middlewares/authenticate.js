const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const authenticate = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(421).send('enter the valid token');
    }
    const token = authHeader.split(' ')[1];
    try{
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = {role:payload.role,id:payload.id};
        next();
    }catch(err){
        console.log('error verifying the access token ',err);
        return res.status(421).send('You are not authorized');
    }
}

module.exports = authenticate;
