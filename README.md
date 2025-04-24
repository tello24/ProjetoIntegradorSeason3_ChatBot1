# 🤖 ChatBot para Restaurante - Projeto Integrador Season 3

![Electron]
![Node.js]
![JavaScript]

## 📌 Visão Geral
ChatBot interativo para restaurantes desenvolvido com Electron, HTML, CSS e JavaScript.

🔗 **Protótipo no Figma:** [Acessar Design](https://www.figma.com/design/fCtj8CQUTwQJYgujfegtDk/Untitled?node-id=1-2&t=tuYnPnGNzIJ9S1wH-1)

## 🚀 Começando

### Pré-requisitos
- Node.js v18+
- npm v9+

### Instalação
```bash
git clone https://github.com/tello24/ProjetoIntegradorSeason3_ChatBot1.git
cd ProjetoIntegradorSeason3_ChatBot1
npm install


### =================================== ###

- Executando
npm start


- Build para produção
npm install --save-dev electron-builder
npm run build
# Executaveis gerado na pasta /dist

🔧 Solução de Problemas

-> Electron não encontrado: <-
rm -rf node_modules package-lock.json
npm install

Erros no build: Verifique o caminho do main no package.json

###### IMPORTANTE!!!!!!!!!!!!!! ###########

🔗 **Atualizar a build:** 🔗

npm run build -- --force

npm run build:win -- --force --x64 --config.extraResources.from=node_modules/electron/dist/resources/icudtl.dat --config.win.icon=Chatbot/build/icon.ico