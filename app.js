const express = require('express');
const sequelize = require('./config/database'); // Importa a configuração do banco
const User = require('./models/User'); // Importa o modelo de Usuário
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const Contract = require('./models/Contract');
const path = require('path');
const Service = require("./models/Service");
const session = require('express-session');




const app = express();

app.use(session({
  secret: 'seu_segreto_unico', // Use uma chave secreta para assinar o ID da sessão.
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // `true` para HTTPS
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// Testa a conexão ao iniciar o servidor
sequelize.authenticate()
  .then(() => console.log('Conectado ao banco de dados com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));



// Sincroniza o banco de dados e garante que as tabelas sejam criadas
sequelize.sync({ force: false }) // force: false para não recriar as tabelas se já existirem
  .then(() => console.log('Tabelas sincronizadas com sucesso'))
  .catch(err => console.error('Erro ao sincronizar tabelas:', err));



app.use(helmet()); // Middleware de segurança
app.use(cors()); // Middleware de CORS
app.use(express.json()); // Middleware para processar JSON

app.use('/api/auth', authRoutes); // Rotas de autenticação

app.use('/api', profileRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', async (req, res) => {
  const services = await Service.findAll();
  res.render('index', { services: services });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
  