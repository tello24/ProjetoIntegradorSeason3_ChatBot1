import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import config from './config/dbConfig.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)

//Iniciar servidor
const PORT = 3333
app.listen(PORT, () => {
    console.log(`🟢 Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
    console.error(`🔴 Erro ao iniciar servidor: ${err.message}`);
})