FROM bitnami/express:4.18.2

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 8085

CMD ["npm","start"]