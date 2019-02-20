FROM node
WORKDIR /app
ENV DEBUG temnames:*
COPY src/* ./src/
COPY crossmatch.json .
COPY package.json .
RUN npm install
CMD ["npm","start"]
