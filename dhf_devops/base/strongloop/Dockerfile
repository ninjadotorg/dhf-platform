FROM dauden/node-base:latest

# File Author / Maintainer
MAINTAINER Black Bean, tuananh@autonomous.nyc

RUN npm install npm@latest -g

WORKDIR /app

USER root

ENV NODE_PATH /usr/local/lib/node/node_modules
ENV NPM_CONFIG_PREFIX=/usr/local/lib/node/.npm-global
RUN npm config set user 0
RUN npm config set unsafe-perm true
RUN npm set progress=false && \
    npm install -g strongloop --unsafe-perm puppeteer

# launch
EXPOSE 9000
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["node server/server.js"]
