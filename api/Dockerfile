FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY data ./data

ENV NODE_ENV=production
ENV DATA_PATH=/app/data

EXPOSE 3001

CMD ["node", "src/index.js"]
