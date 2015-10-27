<%@page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="include/resources.jsp" %>

<!DOCTYPE html>

<html class="no-js" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Logging you into Quanda securely...</title>
    <link rel="stylesheet" type="text/css" href="${gfResources}css/common.css"/>
    <link rel="stylesheet" type="text/css" href="${resourcePath}css/login.css" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="${appRoot}favicon.ico" />
</head>
<body>
    <noscript>
        Your browser doesn't support Javascript or it is disabled. Please enable it or try another browser.
    </noscript>
    <h1 id="loading_message" class="framework_loading_message">Logging you in to Quanda securely...</h1>
<%@ include file="include/gfvars.jsp" %>
    <script type="text/javascript" src="${gfResources}js/modernizr/2.8.3/modernizr.js"></script>
    <script type="text/javascript" src="${gfResources}js/util/util.js"></script>
    <script type="text/javascript" src="${resourcePath}js/util/util.js"></script>
<%@ include file="include/analytics.jsp" %>
    <script type="text/javascript">
        <%--@elvariable id="user" type="org.entitypedia.games.quanda.common.model.QuandaUser"--%>
        <c:if test="${!empty user}">
            storeCredentials("${user.uid}", "${user.password}");
        </c:if>
        <%--@elvariable id="targetURL" type="String"--%>
        <c:if test="${!empty targetURL}">
            window.location = "${targetURL}";
        </c:if>
    </script>
</body>
</html>