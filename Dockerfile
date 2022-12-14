FROM node:15-alpine

EXPOSE 80

# RUN mkdir /opt/travelmap
WORKDIR /opt/travelmap
COPY ./package.json ./package-lock.json ./.npmrc /opt/travelmap/
RUN apk add --virtual .build-deps \
    python \
    make \
    g++ \
  && npm install \
  && apk del .build-deps

COPY . /opt/travelmap

RUN scripts/build-tracks.sh \
  && node scripts/build-travels.js

CMD ["npm", "run", "production"]
