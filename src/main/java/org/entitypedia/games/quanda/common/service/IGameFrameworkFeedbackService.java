package org.entitypedia.games.quanda.common.service;

import org.entitypedia.games.gameframework.common.exceptions.ClueNotFoundException;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public interface IGameFrameworkFeedbackService {

    /**
     * Confirms clue correctness by interpreting players' input as confidence measure.
     * <p>
     * Throws {@link ClueNotFoundException} if clue referred by {@code clueID} is not found.<br>
     * Throws {@link IllegalArgumentException} if confidence is out of [0, 1] interval.<br>
     * <p>
     * Available for games on behalf of players.
     *
     * @param clueID clue to confirm
     * @param confidence confidence of player's knowledge, 0 to 1
     */
    void confirmClue(long clueID, double confidence);

}