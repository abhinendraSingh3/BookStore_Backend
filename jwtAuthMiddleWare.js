const jwt = require('jsonwebtoken');
require('dotenv').config();


//jwt auth is for protected routes only like favourites, orders, cart etc


const jwtAuthMiddleWare = (req, res, next) => {

    //extract authheader
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"token missing"})
    }  

    //token =split authheader to extract token
    const token = authHeader.split(" ")[1];

    try {
        //decoded=verify (token,secret key)
        const decoded = jwt.verify(token, process.env.Secret);

        req.data = decoded;

        //move to the next middleWare
        next();

    }
    catch(err){
        return res.status(401).json({message:"Invalid Token"})
    }

}

module.exports=jwtAuthMiddleWare;

