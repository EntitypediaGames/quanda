#!/bin/sh
mvn clean package jetty:run-exploded -Dmaven.test.skip -Djavax.net.ssl.trustStore=certificates/server.jks -Djavax.net.ssl.keyStorePassword=password