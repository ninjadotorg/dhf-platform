FROM node:latest

# File Author / Maintainer
MAINTAINER Black Bean, tuananh@autonomous.nyc


RUN npm install -g strongloop
ENV NODE_PATH /usr/local/lib/node_modules


# launch
EXPOSE 9000
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["node server/server.js"]
