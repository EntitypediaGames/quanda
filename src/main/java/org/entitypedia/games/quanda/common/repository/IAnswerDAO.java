package org.entitypedia.games.quanda.common.repository;

import org.entitypedia.games.common.repository.ITypedDAO;
import org.entitypedia.games.quanda.common.model.Answer;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public interface IAnswerDAO extends ITypedDAO<Answer, Long> {

    boolean existsAnswer(long questionId);
}
