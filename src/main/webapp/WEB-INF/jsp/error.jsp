<%@page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="include/resources.jsp" %>

<!DOCTYPE html>

<html class="no-js" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Entitypedia Quanda: Error</title>
    <link rel="stylesheet" type="text/css" href="${gfResources}css/common.css"/>
    <link rel="icon" type="image/vnd.microsoft.icon" href="${appRoot}favicon.ico" />
</head>
<body>
    <noscript>
        Your browser doesn't support Javascript or it is disabled. Please enable it or try another browser.
    </noscript>
    <div class="center_page server_error">
        <a href="${appRoot}"><img class="crossword_image" src="${resourcePath}/images/home/quanda-logo-payoff.svg"/></a>
        <img class="background" src="${resourcePath}/images/server_error.svg"/>
        <%--@elvariable id="message" type="java.lang.String"--%>
        <%--@elvariable id="requestURI" type="java.lang.String"--%>
        <p>Oops... We have a problem accessing: ${requestURI}</p>
        <p>${message}</p>
        <br/>
        <%--@elvariable id="details" type="java.lang.String"--%>
        <c:if test="${not empty details}" >
            <span class="button" onclick="$('p').show('slow');$(this).hide('slow')">Details...</span>
            <p style="display:none">${details}</p>
        </c:if>
    </div>
<%@ include file="include/gfvars.jsp" %>
    <script type="text/javascript" src="${gfResources}js/modernizr/2.8.3/modernizr.js"></script>
    <script type="text/javascript" src="${gfResources}js/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="${gfResources}js/util/util.js"></script>
    <script type="text/javascript" src="${resourcePath}js/util/util.js"></script>
<%@ include file="include/analytics.jsp" %>
</body>
</html>