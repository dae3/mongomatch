FROM node
WORKDIR /app
COPY src/*.js ./src/
COPY node_modules ./node_modules/
COPY package.json .
RUN npm install
CMD ["npm","start"]
