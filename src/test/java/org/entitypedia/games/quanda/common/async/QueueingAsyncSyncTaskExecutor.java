package org.entitypedia.games.quanda.common.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.task.AsyncTaskExecutor;

import java.util.Deque;
import java.util.LinkedList;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

/**
 * Executes synchronously all queued tasks. For testing.
 *
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public class QueueingAsyncSyncTaskExecutor implements AsyncTaskExecutor {

    private static final Logger log = LoggerFactory.getLogger(QueueingAsyncSyncTaskExecutor.class);

    private final Deque<Callable> callables = new LinkedList<>();
    private final Deque<Runnable> runnables = new LinkedList<>();

    public final void execute(Runnable task) {
        runnables.addLast(task);
    }

    public final void execute(Runnable task, long startTimeout) {
        throw new UnsupportedOperationException();
    }

    public final Future<?> submit(Runnable task) {
        throw new UnsupportedOperationException();
    }

    public final <T> Future<T> submit(Callable<T> task) {
        callables.addLast(task);
        return null;
    }

    public void startAll() throws Exception {
        while (!callables.isEmpty()) {
            log.debug("Executing queued task");
            callables.removeFirst().call();
        }
        while (!runnables.isEmpty()) {
            log.debug("Executing queued task");
            runnables.removeFirst().run();
        }
    }

    public void clearAll() {
        callables.clear();
    }
}
