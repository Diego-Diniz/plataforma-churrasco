const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Não autorizado, token não fornecido." });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Não autorizado, token inválido." });
    }
};