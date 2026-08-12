const jwt = require('jsonwebtoken');

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    
    if (typeof token === 'undefined') {
        return res.status(401).json({ error: 'No token provided' });
    }

    token = token.slice(7, token.length);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decodedToken;
        next();
    });
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ error: 'Admin access required' });
    }
};
