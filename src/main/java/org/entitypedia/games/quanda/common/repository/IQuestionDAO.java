package org.entitypedia.games.quanda.common.repository;

import org.entitypedia.games.common.repository.ITypedDAO;
import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.model.Question;

import java.util.List;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public interface IQuestionDAO extends ITypedDAO<Question, Long> {

    Question findLastQuestion(QuandaUser user);

    Question findLastQuestionByTopic(QuandaUser user, long topicId);
}