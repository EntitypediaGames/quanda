package org.entitypedia.games.quanda.common.service.impl;

import org.entitypedia.games.gameframework.client.IGamesFrameworkClient;
import org.entitypedia.games.quanda.common.service.IGameFrameworkFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@Service
public class GameFrameworkFeedbackService implements IGameFrameworkFeedbackService {

    @Autowired
    private IGamesFrameworkClient gameFrameworkClient;

    @Override
    @Async("delegatingQueueingAsyncTaskExecutor")
    public void confirmClue(long clueID, double confidence) {
        gameFrameworkClient.confirmClue(clueID, confidence);
    }
}