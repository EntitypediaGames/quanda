package org.entitypedia.games.quanda.common.service.impl;

import org.entitypedia.games.common.service.impl.GameUserService;
import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.service.IQuandaUserService;
import org.springframework.stereotype.Service;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Service
public class QuandaUserService extends GameUserService<QuandaUser> implements IQuandaUserService {

    public QuandaUserService() {
        super(QuandaUser.class);
    }
}