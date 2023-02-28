FROM node:18.14-alpine3.16
USER root
COPY ./ /opt/microservices
RUN cd /opt/microservices \
  && npm i
WORKDIR /opt/microservices
EXPOSE 8099
ENV CMD_RUN_ENV=${BUILD_ENV}
CMD npm run $CMD_RUN_ENV