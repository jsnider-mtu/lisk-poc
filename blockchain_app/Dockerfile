#FROM node:12.22.1-stretch-slim
FROM ubuntu:22.04

EXPOSE 8080
EXPOSE 4000
EXPOSE 5000

RUN apt-get update && apt-get install -y logrotate procps curl python3 make

RUN useradd -m -U -s /bin/bash -p l33th4x0r node

RUN su -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash" node
RUN su -c ". ~/.nvm/nvm.sh && nvm install 12.22.1" node
#RUN nvm install 12.22.1

COPY ./cron /etc/cron.daily/logrotate
RUN chmod +x /etc/cron.daily/logrotate

COPY ./logrotate /etc/logrotate.d/socmed
RUN chmod 644 /etc/logrotate.d/socmed

#USER node

COPY --chown=node:node . /home/node/blockchain_app

WORKDIR /home/node/blockchain_app

RUN su -c ". /home/node/.nvm/nvm.sh && npm i" node
#RUN su -c ". /home/node/.nvm/nvm.sh && /home/node/.nvm/versions/node/v12.22.1/bin/npm i" node

#ENTRYPOINT ["node", "index.js"]
CMD service cron start && su -c "rm /home/node/.lisk/socmed/tmp/pids/controller.pid; /home/node/.nvm/versions/node/v12.22.1/bin/node index.js" node
