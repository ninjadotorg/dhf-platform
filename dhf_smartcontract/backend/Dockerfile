FROM dauden/node-base:latest

MAINTAINER Black Bean, tuananh@autonomous.nyc

RUN mkdir -p /app

WORKDIR /app

# Exclude npm cache from the image
VOLUME /root/.npm

COPY ./package.json /app/package.json
#COPY ./.npmrc /usr/local/.npmrc

RUN npm set progress=false && \
   npm install #--cache-min 9999999999

COPY . /app

EXPOSE 9003 9003
CMD ["/app/node_modules/.bin/node server.js"]
