FROM node:latest

# File Author / Maintainer
MAINTAINER Black Bean, tuananh@autonomous.nyc

# create node user
RUN mkdir /home/node \
   && mkdir /home/node/tmp \
   && groupadd -r node && useradd -r -g node node \
   && usermod -u 1000 node \
   && chown -R node:node /home/node \
   && chown -R node:node /usr/local

RUN apt-get update && apt-get install ruby-full -y \
   && npm install -g grunt-cli \
   && npm install -g bower \
   && gem install compass \
   && gem install sass;

ENV NODE_ENV production
ENV TEMPDIR /home/node/tmp

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 3000
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["node server.js"]
