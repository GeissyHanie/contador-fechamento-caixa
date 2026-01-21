const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// IMPORTAÇÃO DOS MODELOS
const Usuario = require('./models/Usuario');
const Fechamento = require('./models/Fechamento');

const app = express();
app.use(cors());
app.use(express.json());

// --- ROTAS DE AUTENTICAÇÃO ---

// ROTA DE REGISTRO (Criar novo usuário)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado.' });
        }
        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();
        res.status(201).json({ mensagem: '✅ Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: error.message });
    }
});

// ROTA DE LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email }).select('+senha');
        if (!usuario) {
            return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'E-mail ou senha incorretos.' });
        }
        const token = jwt.sign(
            { id: usuario._id }, 
            process.env.JWT_SECRET || 'senha_secreta_provisoria', 
            { expiresIn: '1d' }
        );
        res.json({
            mensagem: '✅ Login realizado!',
            token,
            usuario: { nome: usuario.nome, email: usuario.email }
        });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no servidor', erro: error.message });
    }
});

// --- ROTAS DE FECHAMENTO ---

// ROTA POST: Para receber e salvar o fechamento
app.post('/api/fechamento', async (req, res) => {
    try {
        const novoFechamento = new Fechamento(req.body);
        await novoFechamento.save();
        res.status(201).json({ mensagem: '✅ Fechamento salvo com sucesso!', dados: novoFechamento });
    } catch (error) {
        res.status(400).json({ mensagem: '❌ Erro ao salvar', erro: error.message });
    }
});

// ROTA GET: Para listar todos os fechamentos
app.get('/api/fechamentos', async (req, res) => {
    try {
        const fechamentos = await Fechamento.find().sort({ data: -1 });
        res.json(fechamentos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar dados', erro: error.message });
    }
});

// --- CONEXÃO E INICIALIZAÇÃO ---

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/docesemimos';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB!');
    app.listen(5000, () => console.log('🚀 Servidor rodando na porta 5000'));
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));