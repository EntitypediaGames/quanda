package org.entitypedia.games.quanda.common.service.impl;

import org.entitypedia.games.common.model.ResultsPage;
import org.entitypedia.games.common.oauth.AuthTools;
import org.entitypedia.games.gameframework.client.IGamesFrameworkClient;
import org.entitypedia.games.gameframework.common.model.Clue;
import org.entitypedia.games.quanda.common.exceptions.AnswerMissingException;
import org.entitypedia.games.quanda.common.exceptions.NoMoreQuestionsException;
import org.entitypedia.games.quanda.common.exceptions.QuestionAlreadyAnsweredException;
import org.entitypedia.games.quanda.common.exceptions.QuestionNotFoundException;
import org.entitypedia.games.quanda.common.model.Answer;
import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.model.Question;
import org.entitypedia.games.quanda.common.repository.IAnswerDAO;
import org.entitypedia.games.quanda.common.repository.IQuestionDAO;
import org.entitypedia.games.quanda.common.service.IGameFrameworkFeedbackService;
import org.entitypedia.games.quanda.common.service.IQuandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Service
public class QuandaService implements IQuandaService {

    private static final String AUTH_QUESTION_CREATOR = "hasRole('ROLE_PLAYER') and (principal.id == #question.user.id)";
    private static final String AUTH_PLAYER = "hasRole('ROLE_PLAYER')";

    @Autowired
    private IQuestionDAO questionDAO;

    @Autowired
    private IAnswerDAO answerDAO;

    @Autowired
    private IGamesFrameworkClient gamesFrameworkClient;

    @Autowired
    private IGameFrameworkFeedbackService gameFrameworkFeedbackService;

    /**
     * Confidence value assigned to correct answers.
     */
    private static final double HIGH_CONFIDENCE = 1.0;


    @Override
    @Transactional(rollbackFor = Throwable.class)
    @PreAuthorize(AUTH_PLAYER)
    public Question getQuestion(Boolean changeTopic) {
        // quick and dirty...

        if (null == changeTopic) {
            changeTopic = false;
        }

        Question result;
        Long nextTemplateId = null;
        Long nextClueId = null;

        Question lastQuestion = questionDAO.findLastQuestion(AuthTools.<QuandaUser>getCurrentUser());
        if (null != lastQuestion) {
            nextTemplateId = lastQuestion.getTemplateId();
            nextClueId = lastQuestion.getClueId();
        }
        String filter = "imgUrl-isNull";

        // query the framework by topic and id > id order by id
        if (changeTopic && null != nextTemplateId) {
            // try completely new topic
            filter = "imgUrl-isNull-and-clueTemplate.id-gt-" + Long.toString(nextTemplateId);
            ResultsPage<Clue> clues = gamesFrameworkClient.listClues(1, 0, filter, "Aid");

            if (0 == clues.getOverallCount()) {
                // try just another topic
                filter = "imgUrl-isNull-and-clueTemplate.id-ne-" + Long.toString(nextTemplateId);
                clues = gamesFrameworkClient.listClues(1, 0, filter, "Aid");
            }

            // there should be some results...
            if (0 < clues.getOverallCount()) {
                Clue clue = clues.getItems().get(0);
                // get last question for clue and topic id
                if (null != clue.getClueTemplate() && null != clue.getClueTemplate().getId()) {
                    nextTemplateId = clue.getClueTemplate().getId();
                    lastQuestion = questionDAO.findLastQuestionByTopic(AuthTools.<QuandaUser>getCurrentUser(), nextTemplateId);
                    if (null != lastQuestion) {
                        nextClueId = lastQuestion.getClueId();
                    } else {
                        nextClueId = null;
                    }
                }
            }
        }

        if (null != nextTemplateId) {
            filter = "imgUrl-isNull-and-clueTemplate.id-eq-" + Long.toString(nextTemplateId);
            if (null != nextClueId) {
                filter = filter + "-and-id-gt-" + Long.toString(nextClueId);
            }
        }

        ResultsPage<Clue> clues = gamesFrameworkClient.listClues(1, 0, filter, "Aid");

        // if no results -> relax id
        if (0 == clues.getOverallCount() && !"".equals(filter) && null != nextClueId && null != nextTemplateId) {
            clues = gamesFrameworkClient.listClues(1, 0, "imgUrl-isNull-and-clueTemplate.id-eq-" + Long.toString(nextTemplateId), "Aid");
        }

        // if no results -> relax also the topic
        if (0 == clues.getOverallCount()) {
            clues = gamesFrameworkClient.listClues(1, 0, "imgUrl-isNull", "Aid");
        }

        if (0 == clues.getOverallCount()) {
            throw new NoMoreQuestionsException();
        } else {
            // save question and return
            Clue clue = clues.getItems().get(0);
            result = new Question();
            result.setUser(AuthTools.<QuandaUser>getCurrentUser());
            result.setAnswer(clue.getWord().getWord());
            result.setClueId(clue.getId());
            result.setContent(clue.getContent());
            result.setClueDifficulty(clue.getDifficulty());
            result.setWordDifficulty(clue.getWord().getDifficulty());
            result.setTemplateId(clue.getClueTemplate().getId());
            result.setCreationTime(new Date());
            questionDAO.create(result);
        }

        return result;
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    @PreAuthorize(AUTH_PLAYER)
    public boolean postAnswer(long questionId, String answer) {
        if (null == answer || "".equals(answer.trim())) {
            throw new AnswerMissingException();
        }
        return postAnswer(readQuestion(questionId), answer);
    }

    @Transactional(rollbackFor = Throwable.class)
    @PreAuthorize(AUTH_QUESTION_CREATOR)
    private boolean postAnswer(Question question, String answer) {
        if (answerDAO.existsAnswer(question.getId())) {
            throw new QuestionAlreadyAnsweredException(question.getId());
        }

        Answer a = new Answer();
        a.setAnswer(answer);
        a.setAnswerTime(new Date());
        a.setQuestion(question);
        answerDAO.create(a);

        final boolean result = question.getAnswer().equalsIgnoreCase(answer);

        // treat correct answer as implicit confirmation and send it to the framework
        if (result) {
            gameFrameworkFeedbackService.confirmClue(question.getClueId(), HIGH_CONFIDENCE);
        }

        return result;
    }

    @Transactional(rollbackFor = Throwable.class)
    private Question readQuestion(long questionId) {
        Question result = questionDAO.read(questionId);
        if (null == result) {
            throw new QuestionNotFoundException(questionId);
        }
        return readQuestion(result);
    }

    @Transactional(rollbackFor = Throwable.class)
    @PreAuthorize(AUTH_QUESTION_CREATOR)
    private Question readQuestion(Question question) {
        // sole purpose of this method is to use @PreAuthorize
        // where question variable gives access to question creator
        return question;
    }
}