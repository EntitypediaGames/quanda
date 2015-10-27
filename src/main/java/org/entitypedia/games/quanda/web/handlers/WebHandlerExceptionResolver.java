package org.entitypedia.games.quanda.web.handlers;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Component
public class WebHandlerExceptionResolver implements HandlerExceptionResolver, Ordered {

    public int getOrder() {
        return Integer.MIN_VALUE; // first among handlers
    }

    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // TODO AA this does not work... need to find another method of handling 404s
        if (ex instanceof NoSuchRequestHandlingMethodException) {
            return handleNoSuchRequestHandlingMethod((NoSuchRequestHandlingMethodException) ex, request, response, handler);
        }

        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        ModelAndView error = new ModelAndView("error");
        error.addObject("requestURI", request.getRequestURI());
        error.addObject("message", ex.getMessage());

        StringWriter sw = new StringWriter();
        ex.printStackTrace(new PrintWriter(sw));
        String exceptionAsString = sw.toString();
        error.addObject("details", exceptionAsString);

        return error;
    }

    private ModelAndView handleNoSuchRequestHandlingMethod(NoSuchRequestHandlingMethodException ex, HttpServletRequest request, HttpServletResponse response, Object handler) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        ModelAndView error = new ModelAndView("error");
        error.addObject("requestURI", request.getRequestURI());
        error.addObject("message", "Looks like we cannot find this page. Why don't you start from the homepage?");

        return error;
    }
}
