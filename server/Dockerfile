FROM node:12
# WORKDIR /server/app
WORKDIR /server
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 3030
CMD ["node", "server.js"]