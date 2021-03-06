package org.entitypedia.games.quanda;

import org.entitypedia.games.quanda.common.exceptions.AnswerMissingException;
import org.entitypedia.games.quanda.common.exceptions.QuestionAlreadyAnsweredException;
import org.entitypedia.games.quanda.common.exceptions.QuestionNotFoundException;
import org.entitypedia.games.quanda.common.model.Question;
import org.entitypedia.games.quanda.common.service.IQuandaService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Random;

import static org.junit.Assert.*;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public class TestQuandaAPI extends AbstractQuandaContextTest {

    @Autowired
    private IQuandaService client;

    @Test
    public void testGetQuestion() {
        Question q = client.getQuestion(false);

        assertNotNull(q);
        assertNotNull(q.getId());
        assertNotNull(q.getContent());
        assertNotNull(q.getAnswer());
    }

    @Test
    public void testGetQuestionRepeat() {
        Question q1 = client.getQuestion(false);
        Question q2 = client.getQuestion(false);
        assertFalse(q1.getContent().equals(q2.getContent()));
    }

    @Test(expected = AnswerMissingException.class)
    public void testPostAnswerEmptyStringAnswerMissingException() {
        client.postAnswer(-1L, null);
    }

    @Test(expected = AnswerMissingException.class)
    public void testPostAnswerNullAnswerMissingException() {
        client.postAnswer(-1L, "");
    }

    @Test(expected = QuestionNotFoundException.class)
    public void testPostAnswerQuestionNotFoundException() {
        client.postAnswer(-1L, "a");
    }

    @Test(expected = QuestionAlreadyAnsweredException.class)
    public void testPostAnswerQuestionAlreadyAnsweredException() {
        Question q = client.getQuestion(false);
        boolean correct = client.postAnswer(q.getId(), "a" + (new Random()).nextInt());
        assertFalse(correct);
        client.postAnswer(q.getId(), "a" + (new Random()).nextInt());
    }

    @Test
    public void testPostAnswer() {
        Question q = client.getQuestion(false);
        boolean correct = client.postAnswer(q.getId(), "a" + (new Random()).nextInt());
        assertFalse(correct);
    }
}