FROM node:8-alpine

EXPOSE 8080

RUN npm install -g webpack-dev-server

WORKDIR /code
COPY ./code/package.json /code/
RUN npm install

COPY ./code/webpack.config.js /code

CMD npm run dev
