# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]


FROM node:20-alpine

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code
COPY . .

# Build Next.js untuk produksi
RUN npm run build

# Port default
EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

# Jalankan server
CMD ["npm", "run", "start"]