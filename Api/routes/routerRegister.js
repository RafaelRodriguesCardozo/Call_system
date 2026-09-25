const { Router } = require('express');
const router = Router();
const conexao = require('../infraestrutura/conexao');
const bcrypt = require('bcrypt');

// get, post, put e delete

router.get('/regster', (req,res) => {

    const sql = 'SELECT * FROM USERS'

    conexao.query(sql, (err, results) => {
        if(err){

            console.log(err.message)
            return res.status(400).json({
                Erro: `Erro ao visualizar todos usuários...`,
                detalhes: err.message
            }); 
        }

        return res.status(200).json({
            mensagem: `Sucesso ao visualizar todos os usuários!`, 
            dados: results
        });
    });
});

router.post('/register', async (req, res) => {
    const {usernome, useremail, userpassword_hash} = req.body;

    // Verificação de campos
    if(!usernome || !useremail || !userpassword_hash){
        return res.status(400).json({Erro: `Todos os campos são obrigatórios!`});
    }

    try{
        // Hash de senha
        const hashSenha = await bcrypt.hash(userpassword_hash, 10);

        const valores = [usernome, useremail, hashSenha];
        const sql = (`INSERT INTO USERS (USERNOME, USEREMAIL, USERPASSWORD_HASH) VALUES (?,?,?)`) // Query do Mysql

        conexao.query(sql, valores, (err, results) => {
            if(err){
                return res.status(500).json({
                    Erro: `Erro ao cadastrar usuário...`,
                    detalhes: err.message
                });
            }

            return res.status(201).json({
                mensagem: `O usuário cadastrado com sucesso!`,
                userId: results.insertId
            });
        });

    }catch (err){
        return res.status(500).json({Erro: `Erro interno ao criptografar senha.`});
    }

});

router.put('/register/:id', async (req,res) =>{
    const {id} = req.params;
    const {usernome, useremail, userpassword_hash} = req.body;

    if(!usernome || !useremail || !userpassword_hash){
       return res.status(400).json({Erro: `Todos os campos são obrigatórios!`});
    }

    try{    
        const hashSenha = await bcrypt.hash(userpassword_hash, 10);

        const sql = `UPDATE USERS SET USERNOME = ?, USEREMAIL = ?, USERPASSWORD_HASH = ? WHERE USERID = ?`;
        const valores = [usernome, useremail, hashSenha, id];

        conexao.query(sql, valores, (err, results) => {
            
            if(err){
                return res.status(500).json({
                    Erro: `Houve um erro ao atualizar seu Usuário...`,
                    detalhes: err.message
                });
            }

            return res.status(200).json({
                Mensagem: `Usuário atualizado com sucesso!`,
                userId: results.affectedRows
            });
        });

    }catch (err){
        return res.status(500).json({Erro: `Erro ao realizar a criptografia da senha`})
    }
});

router.delete('/register/:id', (req,res) => {
    const{id} = req.params;

    const sql = `DELETE FROM USERS WHERE USERID = ?`;

    conexao.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({
                Erro: `Ocorreu um erro ao deletar o id: ${id}`,
                detalhes: err.message
            });
        }
         
        if(results.affectedRows === 0){
            return res.status(404).json({
                Erro: `O usuário com id: ${id} não existe!`
            })
        }

        return res.status(200).json({
            Mensagem: `O usuário com id: ${id} foi deletado com sucesso!`,
            userId: results.affectedRows 
        });
    });
});

module.exports = router;