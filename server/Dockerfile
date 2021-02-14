FROM node:latest
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install --only=production
COPY ./dist/apps/admin/main.js /usr/src/server
CMD ["node", "main.js"]
EXPOSE 3000/tcp