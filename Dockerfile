FROM node:15-alpine


RUN mkdir /opt/travelmap
WORKDIR /opt/travelmap
COPY ./package.json ./package-lock.json ./.npmrc /opt/travelmap/
RUN apk add --virtual .build-deps \
    python \
    make \
    g++ \
  && npm install \
  && apk del .build-deps

COPY ./webpack.config.js ./tsconfig.json /opt/travelmap/
COPY src /opt/travelmap/src

EXPOSE 80

CMD ["npm", "run"]
