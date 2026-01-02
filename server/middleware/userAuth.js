import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: 'Authentication token is missing'});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        }else{
            return res.status(401).json({message: 'Invalid authentication token'});
        }

        next();

    }catch (error) {
        return res.status(401).json({message: error.message});
    }
}

export default userAuth;