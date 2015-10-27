# About
Entitypedia Quanda is a sample game written in Java for Entitypedia Games Framework.

# Prerequisites
* Postgres 8.4.11
* JDK 1.7
* Maven 3
* (optional) Appserver with Servlet 3.0 support

# How to build

To build the web application, execute the following:
```
mvn clean package -Dmaven.test.skip
```

# How to run
1. In Postgres create "quanda" user with password "mZEaATQy96oRWghdzleV" (see header of ```000.sql``` for a script).
2. In Postgres create "t_quanda" database owned by "quanda" user. This is configured in the ```quanda.properties``` file. If you wish to use other credentials, just update this config file.
3. In Postgres create the schema and populate the database. Execute one by one sNNN.sql files from models/db, then execute test-data.sql, or using ```models/db/recreate-db``` script.
4. Either a) Build and deploy in an app server
   or     b) Run using ```run``` script

If running using ```run``` script, the app is available under http://localhost:9638/quanda/ or under https://localhost:9639/quanda/
