FROM node:16.15.0-alpine

# Working directory
WORKDIR /home/app/api

# Copy into the container
COPY prisma ./prisma/
COPY package*.json ./

# RUN npm install for dependencies
RUN npm install

COPY . .

# Prisma files generation
RUN npm run prisma:generate

CMD ["npm", "run", "dev"]