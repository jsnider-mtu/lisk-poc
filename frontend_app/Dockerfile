FROM node:12.22.1-stretch-slim

EXPOSE 3000

USER node

COPY . /home/node/frontend_app

WORKDIR /home/node/frontend_app

ENTRYPOINT ["npm", "start"]
