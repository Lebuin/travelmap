FROM node:22-alpine

EXPOSE 80
WORKDIR /opt/travelmap

RUN apk add --no-cache vips-tools

# Install rclone
RUN apk add --no-cache --virtual .build-deps \
    curl \
  && curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip \
  && unzip rclone-current-linux-amd64.zip \
  && cp rclone-*-linux-amd64/rclone /usr/bin \
  && chmod 755 /usr/bin/rclone \
  && rm -r rclone-* \
  && apk del .build-deps

COPY ./package.json ./package-lock.json ./.npmrc /opt/
RUN cd /opt \
  && apk add --virtual .build-deps \
    python3 \
    make \
    g++ \
  && npm install \
  && apk del .build-deps

ENTRYPOINT ["/opt/travelmap/scripts/run.sh"]
