import mongoose from 'mongoose'

const usuariosDataSchema = new mongoose.Schema ({
    nome: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    ra: {
        type: String,
        required: true,
        unique: true
    },
    cpf: {
        type: Number,
        required: true,
        unique: true
    },
    responsavelSeMenor: {
        type: String
    }
})

const usuarios = mongoose.model('usuario', usuariosDataSchema)

export default usuarios