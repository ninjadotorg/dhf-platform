FROM dauden/node:latest

MAINTAINER Black Bean, tuananh@autonomous.nyc

WORKDIR /dhf-platform

# Exclude npm cache from the image
VOLUME /root/.npm

COPY ./package.json /dhf-platform/package.json
COPY ./.npmrc /root/.npmrc

RUN npm set progress=false && \
   npm install #--cache-min 9999999999

ENV STANDARD_CURRENCY EUR

COPY . /dhf-platform
USER root
RUN mkdir /dhf-platform/tmp
RUN mkdir /dhf-platform/tmp/uploads
RUN chown -R node:node /dhf-platform

USER node

EXPOSE 9000
CMD ["node server/server.js"]
