#build app stage
FROM node:lts-alpine as build-stage

# instala um servidor http simples para servir conteúdo estático
RUN npm install -g http-server

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# compila a aplicação de produção com minificação
RUN npm run build


#running server stage
FROM nginx:1.17.8 as production-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]