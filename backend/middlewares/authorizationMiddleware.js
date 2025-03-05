require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkAuthorization = (req, res, next)=>{
    const token = req.headers.authorization;
    if(token){
        try{
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
            if(!decoded.id || !decoded.username){
                return res.status(401).json({ message : 'Authorization Error' });
            }
            req.id = decoded.id;
            req.username = decoded.username;
            next();
        }
        catch(error){
            res.status(401).json({ message : 'Authorization Error' });
        }
    }
    else{
        res.status(401).json({ message : 'Authorization Error' });
    }
}

module.exports = {checkAuthorization};
