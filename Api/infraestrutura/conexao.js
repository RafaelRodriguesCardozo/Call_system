const mysql = require('mysql2');

const conexao = mysql.createConnection ({

  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD, 
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306
});

conexao.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
    return;
  }
  console.log('Conexão segura estabelecida com o MySQL!');
});

module.exports = conexao;