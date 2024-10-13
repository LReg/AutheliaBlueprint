FROM node:latest AS builder

COPY . /myapp
WORKDIR /myapp
RUN npm install
RUN npm run compile

CMD ["npm", "start"]