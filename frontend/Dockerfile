FROM node

WORKDIR /frontend

COPY package*.json ./

RUN npm install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

RUN npm run build --prefix ./

RUN npm install -g serve