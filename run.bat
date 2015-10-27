title "Quanda"
mvn clean package jetty:run-exploded -Dmaven.test.skip -Djavax.net.ssl.trustStore=certificates/server.jks -Djavax.net.ssl.keyStorePassword=password
REM mvn clean package tomcat6:run