import express from 'express'
import novoUsuarioController from './controllers/usuariosController.js'

const routes = express.Router()


//Rota cadastro de usuários
routes.post('/cadastro', novoUsuarioController.create)

//Rota login de usuários
routes.post('/login', novoUsuarioController.login)

export default routes