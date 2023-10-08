
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async ( req, res, next ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new UnauthenticatedError('No token, authorization denied');
    }

    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {userId: payload.userId, name:payload.name}
        next()
    }catch(err){
        throw new UnauthenticatedError('Invalid token, authorization denied');
    }
}

module.exports = auth;