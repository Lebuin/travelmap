FROM node:15-alpine

EXPOSE 80
WORKDIR /opt/travelmap

RUN apk add vips-tools

COPY ./package.json ./package-lock.json ./.npmrc /opt/travelmap/
RUN apk add --virtual .build-deps \
    python \
    make \
    g++ \
  && npm install \
  && apk del .build-deps

COPY . /opt/travelmap

RUN node ./scripts/build-travels.js \
  && ./scripts/simplify-tracks.sh \
  && ./scripts/create-thumbnails.sh

CMD ["npm", "run", "production"]
