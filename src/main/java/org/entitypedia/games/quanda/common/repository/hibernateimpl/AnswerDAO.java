package org.entitypedia.games.quanda.common.repository.hibernateimpl;

import org.entitypedia.games.common.repository.hibernateimpl.AbstractTypedDAO;
import org.entitypedia.games.quanda.common.model.Answer;
import org.entitypedia.games.quanda.common.model.Question;
import org.entitypedia.games.quanda.common.repository.IAnswerDAO;
import org.hibernate.Criteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 * This class implements all DAO methods for Answer.
 *
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Repository
public class AnswerDAO extends AbstractTypedDAO<Answer, Long> implements IAnswerDAO {

    public AnswerDAO() {
        super(Answer.class);
    }

    @Override
    public boolean existsAnswer(long questionId) {
        return 0 != (Long) getSessionFactory().getCurrentSession().createCriteria(Answer.class)
                .add(Restrictions.eq("question.id", questionId))
                .setProjection(Projections.rowCount())
                .uniqueResult();
    }
}