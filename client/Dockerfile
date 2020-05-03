# FROM node:12
# WORKDIR /client
# COPY ./package*.json ./
# RUN npm install
# RUN npm install -g http-server
# COPY . .
# RUN npm run build
# EXPOSE 8080
# CMD ["npm", "testdev"]
# 
FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "http-server", "dist" ]