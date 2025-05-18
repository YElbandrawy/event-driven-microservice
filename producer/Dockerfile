FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .  

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "try { require('kafkajs'); process.exit(0); } catch(e) { process.exit(1); }"

CMD ["node", "producer.js"]