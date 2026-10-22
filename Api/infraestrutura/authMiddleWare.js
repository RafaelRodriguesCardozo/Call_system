const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // O token geralmente vem no formato: "Bearer SEU_TOKEN_AQUI"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido ou expirado." });
        }
        
        // Guarda os dados do usuário na requisição para uso posterior se precisar
        req.user = usuario;
        next();
    });
}

module.exports = verificarToken;