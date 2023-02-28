FROM node:18.14-alpine3.16
USER root
COPY ./ /opt/microservices
RUN apk update && apk add --no-cache redis supervisor \
  && cd /opt/microservices \
  && npm i
WORKDIR /opt/microservices

EXPOSE 9081
CMD ["/usr/bin/supervisord", "-c", "./supervisord.conf"]