FROM node:8-alpine

EXPOSE 8080

# RUN npm install -g webpack-dev-server

WORKDIR /code
COPY ./package.json /code/
RUN npm install

COPY ./webpack.config.js /code
COPY ./tsconfig.json /code

CMD npm run dev
