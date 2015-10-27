package org.entitypedia.games.quanda.api.controller;

import org.entitypedia.games.quanda.common.api.IQuandaAPI;
import org.entitypedia.games.quanda.common.model.Question;
import org.entitypedia.games.quanda.common.service.IQuandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@RestController
public class QuandaController implements IQuandaAPI {

    @Autowired
    private IQuandaService quandaService;

    @Override
    @RequestMapping(value = IQuandaAPI.GET_QUESTION, method = RequestMethod.GET)
    public Question getQuestion(@RequestParam(required = false) Boolean changeTopic) {
        return quandaService.getQuestion(changeTopic);
    }

    @Override
    @RequestMapping(value = IQuandaAPI.POST_ANSWER, method = RequestMethod.POST)
    public boolean postAnswer(@RequestParam long questionId, @RequestParam String answer) {
        return quandaService.postAnswer(questionId, answer);
    }
}