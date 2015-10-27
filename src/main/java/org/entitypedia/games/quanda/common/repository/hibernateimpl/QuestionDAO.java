package org.entitypedia.games.quanda.common.repository.hibernateimpl;

import org.entitypedia.games.common.repository.hibernateimpl.AbstractTypedDAO;
import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.model.Question;
import org.entitypedia.games.quanda.common.repository.IQuestionDAO;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * This class implements all DAO methods for Question.
 *
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Repository
public class QuestionDAO extends AbstractTypedDAO<Question, Long> implements IQuestionDAO {

    public QuestionDAO() {
        super(Question.class);
    }

    @Override
    public Question findLastQuestion(QuandaUser user) {
        return (Question) getSessionFactory().getCurrentSession().createCriteria(Question.class).
                add(Restrictions.eq("user", user)).addOrder(Order.desc("creationTime")).
                setMaxResults(1).uniqueResult();
    }

    @Override
    public Question findLastQuestionByTopic(QuandaUser user, long topicId) {
        return (Question) getSessionFactory().getCurrentSession().createCriteria(Question.class)
                .add(Restrictions.eq("user", user))
                .add(Restrictions.eq("templateId", topicId))
                .addOrder(Order.desc("creationTime"))
                .setMaxResults(1).uniqueResult();
    }
}