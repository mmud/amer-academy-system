const jwt = require("jsonwebtoken");
const User = require("./models/UserModel");

const protect = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // get token from header
            token = req.headers.authorization.split(' ')[1];
            
            if(token == "null" || token == null || token == undefined)
            {
                res.status(401).send("not authorized");
                return;
            }

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            // get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            
            if(req.user.verified == false)
            {
                res.status(401).send("not authorized");
                return;
            }

            next();
        }catch(error){
            console.log(error);
            res.status(401).send("not authorized");
        }
    }
    if(!token)
        res.status(401).send("not authorized");
}

const nd = async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // get token from header
            token = req.headers.authorization.split(' ')[1];
            
            if(token == "null" || token == null || token == undefined)
            {
                res.status(401).send("not authorized");
                return;
            }

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            // get user from the token
            req.user = await User.findById(decoded.id).select('-password');
            
            if(req.user.verified == false)
            {
                res.status(401).send("not authorized");
                return;
            }

            if(req.user.Role != "nd")
            {
                res.status(401).send("not authorized");
                return;
            }

            next();
        }catch(error){
            console.log(error);
            res.status(401).send("not authorized");
        }
    }
    if(!token){
        return res.status(401).send("not authorized");
    }
}

module.exports={protect,nd};