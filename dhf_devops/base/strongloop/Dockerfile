FROM node:latest

# File Author / Maintainer
MAINTAINER Black Bean, tuananh@autonomous.nyc

USER root

RUN apt-get update && \
    apt-get install -y sudo && \
    rm -rf /var/lib/apt/lists/*

RUN npm set progress=false && \
   npm install -g strongloop #--cache-min 9999999999

ENV NODE_PATH /usr/local/lib/node_modules


# launch
EXPOSE 9000
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["node server/server.js"]
