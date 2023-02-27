FROM node:15-alpine

EXPOSE 80
WORKDIR /opt/travelmap

RUN apk add vips-tools

COPY ./package.json ./package-lock.json ./.npmrc /opt/
RUN cd /opt \
  && apk add --virtual .build-deps \
    python \
    make \
    g++ \
  && npm install \
  && apk del .build-deps

ENTRYPOINT ["/opt/travelmap/scripts/run.sh"]
