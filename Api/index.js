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

app.listen(PORT, '0.0.0.0', () => {
    try{
        console.log(`Servidor rodando na porta ${PORT}`);
    }catch{
        console.log(`Ocorreu um problema ao se conectar com seu back-end`);
    }

});