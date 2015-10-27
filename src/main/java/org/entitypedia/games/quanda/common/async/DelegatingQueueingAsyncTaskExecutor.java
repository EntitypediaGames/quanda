package org.entitypedia.games.quanda.common.async;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.task.AsyncTaskExecutor;

import java.util.Deque;
import java.util.LinkedList;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

/**
 * Submits all tasks on signal, wrapping tasks with security context and session.
 *
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public class DelegatingQueueingAsyncTaskExecutor implements AsyncTaskExecutor {

    private static final Logger log = LoggerFactory.getLogger(DelegatingQueueingAsyncTaskExecutor.class);

    private final AsyncTaskExecutor delegate;

    private final ThreadLocal<Deque<Callable>> callables = new ThreadLocal<>();
    private final ThreadLocal<Deque<Runnable>> runnables = new ThreadLocal<>();

    public DelegatingQueueingAsyncTaskExecutor(AsyncTaskExecutor delegate) {
        this.delegate = delegate;
    }

    public final void execute(Runnable task) {
        if (null == runnables.get()) {
            runnables.set(new LinkedList<Runnable>());
        }
        runnables.get().addLast(task);
    }

    public final void execute(Runnable task, long startTimeout) {
        throw new UnsupportedOperationException();
    }

    public final Future<?> submit(Runnable task) {
        if (null == runnables.get()) {
            runnables.set(new LinkedList<Runnable>());
        }
        runnables.get().addLast(task);
        // TODO sorry, no Futures
        return null;
    }

    public final <T> Future<T> submit(Callable<T> task) {
        if (null == callables.get()) {
            callables.set(new LinkedList<Callable>());
        }
        callables.get().addLast(task);
        // TODO sorry, no Futures
        return null;
    }

    public void startAll() {
        Deque<Callable> cTasks = callables.get();
        if (null != cTasks) {
            while (!cTasks.isEmpty()) {
                log.debug("Submitting queued task");
                delegate.submit(cTasks.removeFirst());
            }
            callables.remove();
        }

        Deque<Runnable> rTasks = runnables.get();
        if (null != rTasks) {
            while (!rTasks.isEmpty()) {
                log.debug("Submitting queued task");
                delegate.submit(rTasks.removeFirst());
            }
            runnables.remove();
        }
    }
}