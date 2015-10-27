package org.entitypedia.games.quanda.common.repository.hibernateimpl;

import org.entitypedia.games.common.repository.hibernateimpl.GameUserDAO;
import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.repository.IQuandaUserDAO;
import org.springframework.stereotype.Repository;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Repository
public class QuandaUserDAO extends GameUserDAO<QuandaUser> implements IQuandaUserDAO {

    public QuandaUserDAO() {
        super(QuandaUser.class);
    }
}