const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        select: false 
    },
    // NOVO CAMPO: Define o que o usuário pode ver
    cargo: {
        type: String,
        enum: ['admin', 'funcionario'],
        default: 'funcionario' // Se não avisar nada, será funcionário por padrão
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

UsuarioSchema.pre('save', async function() {
    if (!this.isModified('senha')) return;
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('Usuario', UsuarioSchema);