FROM node:8-alpine

WORKDIR /code
COPY ./package.json ./package-lock.json ./.npmrc /code/
RUN npm install

COPY ./webpack.config.js ./tsconfig.json /code/

CMD npm start
