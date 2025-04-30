import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from './../models/usuariosData.js'

const usuarios = {

    async create(req, res) {
        const { nome, email, senha, ra, cpf, responsavelSeMenor } = req.body

        if (!nome || !email || !senha || !ra || !cpf) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios!' })
        }

        try {
            const usuarioExistente = await Usuario.findOne({ email })

            if (usuarioExistente) {
                return res.status(400).json({ error: 'Este email já está cadastrado.' })
            }

            const hashedSenha = await bcrypt.hash(senha, 10)
            const novoUsuario = new Usuario({ nome, email, senha: hashedSenha, ra, cpf, responsavelSeMenor })
            const usuarioSalvo = await novoUsuario.save()

            res.status(201).json({ nome: usuarioSalvo.nome, email: usuarioSalvo.email })
        } catch (err) {
            console.error(err)
            res.status(500).json({ erro: 'Erro ao salvar o usuário!' })
        }
    },

    async login(req, res) {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' })
        }

        try {
            // Busca usuário no banco de dados
            const usuarioExiste = await Usuario.findOne({ email })

            // Mensagem genérica por segurança (não revelar se o email existe)
            if (!usuarioExiste) {
                return res.status(401).json({ error: "Credenciais inválidas" })
            }

            // Compara senha criptografada
            const senhaValida = await bcrypt.compare(senha, usuarioExiste.senha)
            if (!senhaValida) {
                return res.status(401).json({ error: "Credenciais inválidas" })
            }

            // Gera token JWT
            const token = jwt.sign(
                { userId: usuarioExiste._id, email: usuarioExiste.email },
                "1234",
                { expiresIn: '1h' }
            )

            // Dados do usuário para retornar (sem informações sensíveis)
            const userData = {
                nome: usuarioExiste.nome,
                email: usuarioExiste.email,
            }

            // Retorna resposta de sucesso
            res.status(200).json({
                message: "Login bem-sucedido",
                user: userData,
                token
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Erro durante o login' })
        }
    }


}

export default usuarios