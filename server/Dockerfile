FROM node
WORKDIR /app
COPY src/* ./src/
COPY crossmatch.json .
COPY package.json .
RUN npm install
RUN chown -R 1000 /app
USER 1000
CMD ["npm","start"]
