FROM node:18.14-alpine3.16
USER root
COPY ./ /usr/local
RUN apk update && apk add --no-cache supervisor lsof git curl zsh redis \
  && sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" \
  && npm install -g pnpm && npm cache clean -f \
  && cd /usr/local \
  && pnpm i

# ARG kcptun_targz_url="https://github.com/xtaci/kcptun/releases/download/v20230207/kcptun-linux-amd64-20230207.tar.gz"
# RUN  set -ex \
#   && wget "${kcptun_targz_url}" -O /tmp/kcptun.tar.gz \
#   && mkdir -p /usr/local/kcptun && tar -zxf /tmp/kcptun.tar.gz -C /usr/local/kcptun \
#   && mv /usr/local/kcptun/server_linux_amd64 /usr/local/kcptun/server_linux \
#   && rm /tmp/kcptun.tar.gz

CMD ["/usr/bin/supervisord", "-c", "./supervisord.conf"]
