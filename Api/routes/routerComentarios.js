const { Router } = require('express');
const router = Router();
const conexao = require('../infraestrutura/conexao');

// get, post, put e delete

router.get('/tickets/:id/comentarios', (req,res) => {
    const {id} = req.params;

    const sql = 'SELECT * FROM TICKET_COMENTARIOS'

    conexao.query(sql, [id], (err, results) => {
        if(err){

            console.log(err.message)
            return res.status(400).json({
                Erro: `Erro ao se comunicar com banco de dados`,
                detalhes: err.message
            }); 
        }

        return res.status(200).json({
            mensagem: `Sucesso!`, 
            dados: results
        });
    });
});

router.post('/tickets/comentarios', async (req, res) => {
    const {ticketId, userId, mensagem} = req.body;

    if(!ticketId || !userId || !mensagem){
        return res.status(400).json({Erro: `Todos os campos são obrigatórios!`});
    }

    const valores = [ticketId, userId, mensagem];

    const sql = (`INSERT INTO TICKET_COMENTARIOS (TICKETID, USERID, MENSAGEM) VALUES (?,?,?)`)

    conexao.query(sql, valores, (err, results) => {
        if(err){
            return res.status(500).json({
                Erro: `Ocorreu um erro ao comentar o chamado...`,
                detalhes: err.message
            });
        }

        return res.status(201).json({
            mensagem: `O comentario foi inserido com sucesso!`,
            ticketId: results.insertId
        });
    });
});

router.put('/tickets/:id/updateComentario', (req,res) =>{
    const {id} = req.params;
    const {mensagem} = req.body;

    if(!mensagem){
        return res.status(400).json({Erro: `O campo de mensagem é obrigatório!`});
    }

    const sql = `UPDATE TICKET_COMENTARIOS SET MENSAGEM = ? WHERE TICKETCOMENTARIOSID = ?`;
    const valores = [mensagem, id];

    conexao.query(sql, valores, (err, results) => {
        
        if(err){
            return res.status(500).json({
                Erro: `Houve um erro ao atualizar seu Comentario...`,
                detalhes: err.message
            });
        }

        if(results.affectedRows === 0){
            return res.status(404).json({Erro: `Comentario com id: ${id} não existe.`});
        }

        return res.status(200).json({
            Mensagem: `Comentario atualizado com sucesso!`,
        });
    });
});

router.delete('/tickets/:id/deleteComentario', (req,res) => {
    const{id} = req.params;

    const sql = `DELETE FROM TICKET_COMENTARIOS WHERE TICKETCOMENTARIOSID = ?`;

    conexao.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({
                Erro: `Ocorreu um erro ao deletar o comentario com id: ${id}`,
                detalhes: err.message
            });
        }
         
        if(results.affectedRows === 0){
            return res.status(404).json({
                Erro: `O comentario com id: ${id} não existe!`
            })
        }

        return res.status(201).json({
            Mensagem: `O comentario com id: ${id} foi deletado com sucesso!`,
            results: results.affectedRows
        })
    })
});

module.exports = router;