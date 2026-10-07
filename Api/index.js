const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const router = require("./routes/index");
const conexao = require("./infraestrutura/conexao");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 100 requisições por IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        erro: 'Muitas requisições feitas a partir deste IP, tente novamente mais tarde.'
    }
});
app.use(limiter);
console.log(limiter);

router(app);

const PORT = 3036;

app.listen(PORT, '0.0.0.0', () => {
    try{
        console.log(`Servidor rodando na porta ${PORT}`);
    }catch{
        console.log(`Ocorreu um problema ao se conectar com seu back-end`);
    }

});