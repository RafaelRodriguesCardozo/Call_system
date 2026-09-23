const { Router } = require('express');
const router = Router();
const conexao = require('../infraestrutura/conexao');

// get, post, put e delete

router.get('/tickets', (req,res) => {

    const sql = 'SELECT * FROM TICKETS'

    conexao.query(sql, (err, results) => {
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

router.post('/tickets', async (req, res) => {
    console.log('--- [TESTE DE MESA] Requisição POST /tickets recebida ---');
    console.log('1. Corpo (req.body) enviado pelo Front-end:', req.body);

    const { title, description, userId, prioridade } = req.body;

    // Verificação de campos obrigatórios
    if (!title || !description) {
        console.log('❌ FALHA: Título ou descrição estão vazios.');
        return res.status(400).json({ Erro: `Todos os campos são obrigatórios!` });
    }

    // Montando o array de valores
    const prioridadeFinal = prioridade || 'MÉDIA';
    const valores = [title, description, userId, prioridadeFinal];

    console.log('2. Valores que serão injetados no SQL:', valores);
    console.log('   - title:', title, `(${typeof title})`);
    console.log('   - description:', description, `(${typeof description})`);
    console.log('   - userId:', userId, `(${typeof userId})`);
    console.log('   - prioridade:', prioridadeFinal, `(${typeof prioridadeFinal})`);

    const sql = `INSERT INTO TICKETS (TITLE, DESCRIPTION, USERID, PRIORIDADE) VALUES (?,?,?,?)`;
    console.log('3. Query SQL gerada:', sql);

    conexao.query(sql, valores, (err, results) => {
        if (err) {
            console.log('❌ ERRO NO MYSQL:', err.code);
            console.log('   - Mensagem detalhada:', err.message);

            if (err.errno === 1452) {
                console.log('   -> Motivo: Chave estrangeira violada (O userId não existe na tabela de usuários).');
                return res.status(404).json({ Erro: `O usuário com id: ${userId} não existe no banco de dados.` });
            }

            return res.status(500).json({
                Erro: `Falha ao inserir chamado... Por favor, verifique se todas as informações foram preenchidas`,
                detalhes: err.message
            });
        }

        console.log('SUCESSO! Chamado inserido com ID:', results.insertId);
        return res.status(201).json({
            mensagem: `O chamado foi inserido com sucesso!`,
            ticketId: results.insertId
        });
    });
});

router.put('/tickets/:id', (req,res) =>{
    const {id} = req.params;
    const {title, description, status, prioridade, data} = req.body;

    const sql = `UPDATE TICKETS SET TITLE = ?, DESCRIPTION = ?, STATUS = ?, PRIORIDADE = ? WHERE TICKETID = ?`;
    const valores = [title, description, status, prioridade, id];

    conexao.query(sql, valores, (err, results) => {
        
        if(err){
            return res.status(500).json({
                Erro: `Houve um erro ao atualizar seu Chamado...`,
                detalhes: err.message
            });
        }

        return res.status(201).json({
            Mensagem: `Chamado atualizado com sucesso!`,
            result: data
        });
    });
});

router.delete('/tickets/:id', (req,res) => {
    const{id} = req.params;

    const sql = `DELETE FROM TICKETS WHERE TICKETID = ?`;

    conexao.query(sql, [id], (err, results) => {
        if(err){
            return res.status(500).json({
                Erro: `Ocorreu um erro ao deletar o id: ${id}`,
                detalhes: err.message
            });
        }
         
        if(results.affectedRows === 0){
            return res.status(404).json({
                Erro: `O id: ${id} não existe!`
            })
        }

        return res.status(201).json({
            Mensagem: `O chamado com id: ${id} foi deletado com sucesso!`,
            results: results.affectedRows
        })
    })
});

module.exports = router;