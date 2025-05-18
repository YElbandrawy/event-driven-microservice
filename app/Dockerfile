FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .  

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { hostname: 'localhost', port: 3000, path: '/api/v1/logs', method: 'GET' }; const req = http.request(options, (res) => { process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.end();"

CMD ["node", "server.js"]