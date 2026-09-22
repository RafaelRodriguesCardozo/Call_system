const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/index')
const conexao = require('./infraestrutura/conexao')

const app = express();
app.use(cors());
app.use(express.json());
router(app);

const PORT = 3036;

// Mensagem de inicio do servidor
app.listen(PORT, () => {
    try{
        console.log(`Servidor rodando! : http://localhost:${PORT}`);
    }catch(err){
        console.log(err);
    }
});