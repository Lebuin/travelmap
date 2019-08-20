FROM node:8-alpine

EXPOSE 8080

WORKDIR /code
COPY ./package.json ./package-lock.json ./.npmrc /code/
RUN npm install

COPY ./webpack.config.js ./tsconfig.json /code/

CMD npm start
