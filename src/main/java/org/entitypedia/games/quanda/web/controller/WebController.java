package org.entitypedia.games.quanda.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Handles pages requests.
 *
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Controller
public class WebController {

    @Autowired
    private Environment environment;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ModelAndView home() {
        ModelAndView mav = new ModelAndView("index");
        return mav;
    }

    @RequestMapping(value = "apidocs", method = RequestMethod.GET)
    public RedirectView apidocs() {
        return new RedirectView("/apidocs/", true);
    }

    @RequestMapping(value = "apidocs/", method = RequestMethod.GET)
    public ModelAndView apidocsHome() {
        return new ModelAndView("apidocs");
    }
}