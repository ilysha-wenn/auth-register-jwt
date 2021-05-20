require('dotenv').config();
const jwt = require('jsonwebtoken');


module.exports = function(req,res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Доступ запрещен');
    try {
        const verified = jwt.verify(token, process.env.TOKEN);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Не правильный токен');
    }
}