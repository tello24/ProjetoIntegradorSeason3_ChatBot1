import mongoose from 'mongoose'

const dbConfig = "mongodb+srv://matheusGmattoso:matheusGmattoso@principal.h3p6b.mongodb.net/ProjetoIntegrador3?retryWrites=true&w=majority&appName=Principal"

mongoose.connect(dbConfig, {})
    .then(() => console.log("🟢 MongoDB conectado com sucesso"))
    .catch((err) => console.error("🔴 Erro ao conectar no MongoDB:", err))

export default mongoose