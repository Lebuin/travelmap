FROM node:22-alpine

WORKDIR /opt/travelmap

RUN apk add --no-cache vips-tools

# Install rclone
RUN wget https://downloads.rclone.org/rclone-current-linux-amd64.zip \
  && unzip rclone-current-linux-amd64.zip \
  && cp rclone-*-linux-amd64/rclone /usr/bin \
  && chmod 755 /usr/bin/rclone \
  && rm -r rclone-*

COPY ./package.json ./package-lock.json /opt/
RUN cd /opt && npm ci

EXPOSE 80
ENV PORT 80
ENV HOSTNAME 0.0.0.0

ENTRYPOINT ["/opt/travelmap/scripts/run.sh"]
