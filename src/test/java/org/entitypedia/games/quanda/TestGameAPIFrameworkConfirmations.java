package org.entitypedia.games.quanda;

import org.entitypedia.games.gameframework.client.template.SignalingGameFrameworkRESTTemplate;
import org.entitypedia.games.quanda.common.async.QueueingAsyncSyncTaskExecutor;
import org.entitypedia.games.quanda.common.model.Question;
import org.entitypedia.games.quanda.common.service.IQuandaService;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextHierarchy;

import java.util.Map;
import java.util.Queue;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@ContextHierarchy({
        @ContextConfiguration(name = "root", locations = "classpath:conf/spring/root-context-override.xml"),
})
public class TestGameAPIFrameworkConfirmations extends AbstractQuandaContextTest {

    @Autowired
    private IQuandaService client;

    @Autowired
    private SignalingGameFrameworkRESTTemplate template;

    @Autowired
    private QueueingAsyncSyncTaskExecutor executor;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        executor.clearAll();
        template.clearClueConfirmationReports();
    }

    @Test
    public void testPostAnswer() throws Exception {
        Question q = client.getQuestion(false);
        // answer is available in Test* because it's not serialized yet
        boolean correct = client.postAnswer(q.getId(), q.getAnswer());

        // execute scheduled tasks
        executor.startAll();

        // check there is a confirmation
        Map<Long, Queue<Double>> confirmations = template.getClueConfirmationReports();
        assertNotNull(confirmations);
        assertEquals(1, confirmations.size());
        Queue<Double> conf = confirmations.get(q.getClueId());
        assertEquals(1, conf.size());
    }
}