const jwt = require('jsonwebtoken')

//doesn't throw error, only sets metadata to true or false of isAuth
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if(!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1]; //Bearer token_dafadsfasdfa
    if(!token || token === '') {
        req.isAuth = false
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretkey');
    } catch (err) {
        req.isAuth = false
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next()

}
