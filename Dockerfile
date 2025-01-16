# Use a imagem base do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de configuração e dependências para o container
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Construa a aplicação para produção
RUN npm run build

# Exponha a porta que será usada pelo servidor
EXPOSE 5173

# Comando para rodar a aplicação em produção
CMD ["npm", "run", "preview"]
