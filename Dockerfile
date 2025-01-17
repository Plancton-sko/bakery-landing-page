# Etapa de build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código fonte
COPY . .

# Construir o projeto
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos do build
COPY --from=build /app/build ./

# Copiar arquivos necessários para dependências de produção
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Instalar dependências de produção
RUN npm install --omit=dev

# Definir o ambiente como produção
ENV NODE_ENV=production

# Expor a porta do servidor
EXPOSE 3000

# Iniciar o servidor
CMD ["node", "index.js"]