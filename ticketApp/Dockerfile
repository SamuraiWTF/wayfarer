FROM node:12-slim

WORKDIR /app

# Dependency Layer
COPY package*.json ./
RUN npm install

# App Layer
COPY . .
RUN npm run build

# Execute
EXPOSE 3000
CMD npm run start