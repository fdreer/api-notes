FROM node:18.16.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run dist
EXPOSE 3000
CMD ["npm","start"]