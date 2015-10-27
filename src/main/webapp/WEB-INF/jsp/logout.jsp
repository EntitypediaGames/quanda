<%@page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@include file="include/resources.jsp" %>

<!DOCTYPE html>

<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Logging you out of Quanda securely...</title>
    <link rel="stylesheet" type="text/css" href="${gfResources}css/common.css" />
    <link rel="stylesheet" type="text/css" href="${resourcePath}css/login.css" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="${appRoot}favicon.ico" />
</head>
<body>
    <noscript>
        Your browser doesn't support Javascript or it is disabled. Please enable it or try another browser.
    </noscript>
    <h1 id="loading_message" class="framework_loading_message">Logging you out of Quanda securely...</h1>
<%@ include file="include/gfvars.jsp" %>
    <script type="text/javascript" src="${gfResources}js/modernizr/2.8.3/modernizr.js"></script>
    <script type="text/javascript" src="${gfResources}js/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="${gfResources}js/jquery-encoder/0.1.0/Class.create.js"></script>
    <script type="text/javascript" src="${gfResources}js/jquery-encoder/0.1.0/jquery-encoder-0.1.0.js"></script>
    <script type="text/javascript" src="${gfResources}js/jquery-reveal/1.0.0/jquery.reveal.js"></script>
    <script type="text/javascript" src="${gfResources}js/util/util.js"></script>
    <script type="text/javascript" src="${resourcePath}js/util/util.js"></script>
<%@ include file="include/analytics.jsp" %>
    <script type="text/javascript">
        $(document).ready(function(){
        	eraseCredentials();
        	redirectToFrameworkLogout();
        });
    </script>
</body>
</html>