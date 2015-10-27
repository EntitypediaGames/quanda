<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%--@elvariable id="quandaProperties" type="java.util.Properties"--%>
<c:set var="gfResources" value="${\"https\".equals(pageContext.request.scheme) ? quandaProperties['gameframework.secure.resources'] : quandaProperties['gameframework.resources']}"/>
<c:set var="gfRoot" value="${\"https\".equals(pageContext.request.scheme) ? quandaProperties['gameframework.secure.root'] : quandaProperties['gameframework.root']}"/>
<c:set var="gfSecureRoot" value="${quandaProperties['gameframework.secure.root']}"/>
<c:set var="appSecurePort" value="${quandaProperties['app.secure.port']}"/>
<c:set var="appVersion" value="${quandaProperties['app.version']}" />
<c:url value="/resources-${appVersion}/" var="resourcePath"/>
<c:url value="/" var="appRoot"/>
<spring:eval expression="@environment['google.analytics.id']" var="googleAnalyticsId"/>
<%--
example usage:
<%@include file="include/resources.jsp" %>
${gfResources}
--%>