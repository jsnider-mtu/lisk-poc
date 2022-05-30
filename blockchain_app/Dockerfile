FROM node:12.22.1-stretch-slim

EXPOSE 8080
EXPOSE 4000
EXPOSE 5000

RUN apt-get update && apt-get install -y logrotate procps

COPY ./cron /etc/cron.daily/logrotate
RUN chmod +x /etc/cron.daily/logrotate

COPY ./logrotate /etc/logrotate.d/socmed
RUN chmod 644 /etc/logrotate.d/socmed

#USER node

COPY . /home/node/blockchain_app

WORKDIR /home/node/blockchain_app

#ENTRYPOINT ["node", "index.js"]
CMD service cron start && su -c "rm /home/node/.lisk/socmed/tmp/pids/controller.pid; node index.js" node
