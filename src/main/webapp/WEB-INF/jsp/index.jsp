<%@ page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file="include/resources.jsp" %>

<!DOCTYPE html>

<html class="no-js" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Entitypedia Quanda</title>
    <link rel="stylesheet" type="text/css" href="${gfResources}css/common.css"/>
    <link rel="stylesheet" type="text/css" href="${resourcePath}css/common.css"/>
    <link rel="stylesheet" type="text/css" href="${resourcePath}css/qa_home.css"/>
    <link rel="stylesheet" type="text/css" href="${gfResources}css/jquery-fancybox/2.1.5/jquery.fancybox.css"/>
    <link rel="icon" type="image/vnd.microsoft.icon" href="${appRoot}resources/favicon.ico"/>
<%--
    <link rel="shortcut icon" href="${appRoot}/resources/favicon.ico" type="image/x-icon">
    <link rel="icon" href="${appRoot}/resources/favicon.ico" type="image/x-icon">
--%>
</head>
<body>
<header>
    <noscript>
        Your browser doesn't support Javascript or it is disabled. Please enable it or try another browser.
    </noscript>
    <div id="quanda_logo">
        <img src="${resourcePath}images/home/quanda-logo-payoff.svg"/>
    </div>
    <div id="login">
        <div id="login_links">
            <input id="login_button" class="button" type="submit" value="Register / Login"/>
        </div>
    </div>
</header>
<section>
    <aside id="quanda_top">
        <div id="start_quanda">
            <div class="list_item">
                <div class="list_item_info">
                    <span id="start_title" class="item_title">Ready for a challenge?</span>

                    <div class="item_buttons">
                        <a class="play_button button" id="play_button">Start</a>
                    </div>
                    <ul id="switches" style="display: none">
                        <li id="topic_switch" class="switch">
                            <span>Change topic</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>


        <div id="round_quanda" style="display: none">

            <div class="list_item">
                <div class="list_item_info">
                    <span id="q_text" class="item_title">Question text?</span>

                    <div class="row">
                        <div class="item_buttons">
                            <div class="assisted_area assisted">
                                <div id="answerPreview" class="row_selected crosswordImageElement"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item_buttons">
                <a class="play_button button" id="answer_button">Answer</a>
                <a class="play_button button" id="skip_button">Skip</a>
            </div>
        </div>
    </aside>
</section>
<footer>
    <a href="http://cordis.europa.eu/fp7/home_en.html" target="_blank"><img src="${gfResources}images/logo-seventh-framework.jpg"/></a>
    <a href="http://www.europa.eu" target="_blank"><img src="${gfResources}images/logo-ue.jpg"/></a>
    <a href="http://www.cubrikproject.eu" target="_blank"><img src="${gfResources}images/logo-cubrik.jpg"/></a>
</footer>
<!-- MANDATORY: set var with GF Resources -->
<%@ include file="include/gfvars.jsp" %>
<%@ include file="include/gfscripts.jsp" %>

<!-- MANDATORY: include game and framework util.js in this order (and before page scripts): -->
<script type="text/javascript" src="${resourcePath}js/util/util.js"></script>
<script type="text/javascript" src="${resourcePath}js/qa_home.js"></script>
<script type="text/javascript" src="${resourcePath}js/jquery-crossword-image/1.0.0/jquery.crossword-image.js"></script>
<%@ include file="include/analytics.jsp" %>
</body>
</html>