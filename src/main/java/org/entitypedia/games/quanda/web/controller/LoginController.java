package org.entitypedia.games.quanda.web.controller;

import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.service.IQuandaUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Controller
public class LoginController {

    @Autowired
    private IQuandaUserService quandaUserService;

    /**
     * Prepares login page.
     *
     * @param uid       user id in the game framework
     * @param targetURL where we were going originally
     * @return ModelAndView to render
     */
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView login(@RequestParam(required = false) String uid,
                              @RequestParam(required = false) String targetURL) {

        // control gets here with access tokens already in place

        ModelAndView mav = new ModelAndView("login");
        mav.addObject("targetURL", targetURL);

        // handle uid - check if user exists locally, create it, generate password, send it to the client.
        // TODO users are actually imported earlier in DBConsumerTokenServices to satisfy constraint on token creation
        QuandaUser user = quandaUserService.importUser(uid);
        mav.addObject("user", user);

        return mav;
    }

    /**
     * Prepares logout page.
     */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout() {
        return "logout";
    }
}
