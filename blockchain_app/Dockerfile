FROM node:12.22.1-stretch-slim

EXPOSE 8080
EXPOSE 4000
EXPOSE 5000

USER node

COPY . /home/node/blockchain_app

WORKDIR /home/node/blockchain_app

ENTRYPOINT ["node", "index.js"]
