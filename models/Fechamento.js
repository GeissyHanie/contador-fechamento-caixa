const mongoose = require('mongoose');

const FechamentoSchema = new mongoose.Schema({
    data: { 
        type: Date, 
        default: Date.now 
    },
    operador: { 
        type: String, 
        required: true 
    },
    valorInicial: { 
        type: Number, 
        required: true 
    },
    totalContado: { 
        type: Number, 
        required: true 
    },
    totalSangrias: { 
        type: Number, 
        default: 0 
    },
    valorLiquido: { 
        type: Number, 
        required: true 
    },
    observacoes: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['aberto', 'fechado'], 
        default: 'fechado' 
    }
});

module.exports = mongoose.model('Fechamento', FechamentoSchema);