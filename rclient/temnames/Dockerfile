FROM node AS react-builder

RUN mkdir /build
WORKDIR /build

COPY package.json .
COPY src src/
COPY public public/
ENV REACT_APP_APIHOST localhost
ENV REACT_APP_APIPORT 8000
RUN npm install
RUN npm run-script build

FROM httpd:2.4
RUN sed -i \
	-e 's/^#\(LoadModule rewrite_module modules\/mod_rewrite.so\)/\1/' \
	/usr/local/apache2/conf/httpd.conf
RUN sed -i \
	-e 's/AllowOverride None/AllowOverride FileInfo/' \
	/usr/local/apache2/conf/httpd.conf
COPY public/.htaccess /usr/local/apache2/htdocs/
COPY --from=react-builder /build/build /usr/local/apache2/htdocs/
COPY --from=react-builder /build/build/static /usr/local/apache2/htdocs/static/
COPY --from=react-builder /build/build/static/js /usr/local/apache2/htdocs/static/js/

