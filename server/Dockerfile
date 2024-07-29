FROM node:22-alpine

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]