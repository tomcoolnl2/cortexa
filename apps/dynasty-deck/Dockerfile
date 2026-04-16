# Use official Node.js image as the base
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || yarn install --frozen-lockfile
COPY . .
RUN npm run build || yarn build
EXPOSE 3000
CMD ["npm", "run", "start"]
