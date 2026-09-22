const { Router } = require('express');
const router = Router();
const conexao = require('../infraestrutura/conexao');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
    const { useremail, userpassword } = req.body;

    // Validação dos campos
    if (!useremail || !userpassword) {
        return res.status(400).json({ Erro: 'E-mail e senha são obrigatórios!' });
    }

    // Busca o usuário pelo e-mail no banco de dados
    const sql = 'SELECT * FROM USERS WHERE USEREMAIL = ?';

    conexao.query(sql, [useremail], async (err, results) => {
        if (err) {
            return res.status(500).json({ 
                Erro: 'Erro interno no servidor.', 
                detalhes: err.message 
            });
        }

        // Verifica se o usuário existe
        if (results.length === 0) {
            return res.status(401).json({ Erro: 'E-mail ou senha incorretos.' });
        }

        const usuario = results[0];

        try {
            // Compara a senha digitada com a hash salva no banco
            const senhaValida = await bcrypt.compare(userpassword, usuario.USERPASSWORD_HASH);

            if (!senhaValida) {
                return res.status(401).json({ Erro: 'E-mail ou senha incorretos.' });
            }

            // Login bem-sucedido (retorna dados básicos sem a senha)
            return res.status(200).json({
                mensagem: 'Login realizado com sucesso!',
                usuario: {
                    id: usuario.USERID,
                    nome: usuario.USERNOME,
                    email: usuario.USEREMAIL,
                    role: usuario.ROLE
                }
            });

        } catch (error) {
            return res.status(500).json({ Erro: 'Erro ao processar a autenticação.' });
        }
    });
});

module.exports = router;