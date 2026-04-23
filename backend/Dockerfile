FROM node:20-alpine AS builder

ENV NODE_ENV=build

USER node
WORKDIR /home/node

COPY package.json ./
RUN npm install

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --omit=dev


FROM node:20-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 8080
CMD ["node", "dist/main.js"]