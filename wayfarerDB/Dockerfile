FROM mysql:5

ENV MYSQL_ROOT_PASSWORD=changeme
COPY init/ /docker-entrypoint-initdb.d/

EXPOSE 3306