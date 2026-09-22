const mysql = require('mysql2');

const conexao = mysql.createConnection ({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME,
  port: process.env.PORT || 3306

});

conexao.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
    return;
  }
  console.log('Conexão segura estabelecida com o MySQL!');
});

module.exports = conexao;