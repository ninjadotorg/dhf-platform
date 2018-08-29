FROM dauden/strongloop-base:latest

MAINTAINER Black Bean, tuananh@autonomous.nyc

WORKDIR /app

# Exclude npm cache from the image
VOLUME /root/.npm

COPY ./package.json /app/package.json
#COPY ./.npmrc /usr/local/.npmrc

RUN npm set progress=false && \
   npm install #--cache-min 9999999999

COPY . /app
USER root
RUN chown -R node:node /app

USER node


EXPOSE 9000
CMD ["node /app/server/server.js"]