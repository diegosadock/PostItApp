const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2'); // Usamos mysql2 em vez do mysql

const app = express();
const port = 3000;

app.use(cors());

// Configuração do MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'postit', // Nome do seu banco de dados
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/registro', (req, res) => {
    // Lógica para lidar com a requisição GET para /registro
    res.send('Página de registro');
  });

// Rota para registro de usuário
app.post('/registro', (req, res) => {
  const { nome, email, senha } = req.body;

  // Lógica de validação (exemplo simples)
  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  // Consulta preparada para inserção no banco de dados
  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.execute(sql, [nome, email, senha], (err, result) => {
    if (err) {
      console.error('Erro ao registrar usuário: ' + err);
      res.status(500).json({ mensagem: 'Erro interno' });
    } else {
      console.log('Usuário registrado com sucesso');
      res.status(200).json({ mensagem: 'Registro bem-sucedido' });
    }
  });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
  
    // Verifique se o email e a senha correspondem a um registro no banco de dados
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.execute(sql, [email, senha], (err, results) => {
      if (err) {
        console.error('Erro ao verificar credenciais: ' + err);
        res.status(500).json({ mensagem: 'Erro interno' });
      } else {
        if (results.length > 0) {
          // Credenciais válidas, o usuário está autenticado
          res.status(200).json({ autenticado: true });
        } else {
          // Credenciais inválidas, o usuário não está autenticado
          res.status(401).json({ autenticado: false });
        }
      }
    });
  });

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor Node.js rodando na porta ${port}`);
});
