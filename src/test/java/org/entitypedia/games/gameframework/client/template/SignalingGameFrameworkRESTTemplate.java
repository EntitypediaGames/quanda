package org.entitypedia.games.gameframework.client.template;

import org.springframework.security.oauth.consumer.ProtectedResourceDetails;

import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;

/**
 * Collects and keeps confirmations for testing.
 *
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public class SignalingGameFrameworkRESTTemplate extends GamesFrameworkRESTTemplate {

    private final ThreadLocal<Map<Long, Queue<Double>>> confidenceMap = new ThreadLocal<>();

    public SignalingGameFrameworkRESTTemplate(ProtectedResourceDetails resource) {
        super(resource);
    }

    @Override
    public void confirmClue(long clueID, double confidence) {
        reportConfirmClue(clueID, confidence);
    }

    private void reportConfirmClue(long clueID, double confidence) {
        Map<Long, Queue<Double>> confMap = confidenceMap.get();
        if (null == confMap) {
            confMap = new HashMap<>();
            confidenceMap.set(confMap);
        }
        Queue<Double> q = confMap.get(clueID);
        if (null == q) {
            q = new ArrayDeque<>();
            confMap.put(clueID, q);
        }
        q.add(confidence);
    }

    public void clearClueConfirmationReports() {
        confidenceMap.remove();
    }

    public Map<Long, Queue<Double>> getClueConfirmationReports() {
        return confidenceMap.get();
    }
}