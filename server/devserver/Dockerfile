FROM node
RUN npm install -g nodemon

VOLUME /app

ENV DEBUG temnames:*
ENV API_HOST server_db_1
ENV API_PORT 8081
EXPOSE 8081

COPY devstart.sh /
CMD /devstart.sh
