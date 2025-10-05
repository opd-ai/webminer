FROM node:18-alpine
WORKDIR /app
COPY package.json proxy-server.js ./
RUN npm install --production
EXPOSE 8080
CMD ["node", "proxy-server.js"]
