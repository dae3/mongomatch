FROM node
WORKDIR /app
COPY src/* ./src/
COPY crossmatch.json .
COPY package.json .
RUN npm install
CMD ["npm","start"]
