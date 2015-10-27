package org.entitypedia.games.quanda;

import org.apache.log4j.PropertyConfigurator;
import org.entitypedia.games.quanda.common.model.QuandaUser;
import org.entitypedia.games.quanda.common.repository.IQuandaUserDAO;
import org.hibernate.SessionFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.orm.hibernate4.SessionFactoryUtils;
import org.springframework.orm.hibernate4.SessionHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.oauth.provider.ConsumerAuthentication;
import org.springframework.security.oauth.provider.ConsumerCredentials;
import org.springframework.security.oauth.provider.ConsumerDetails;
import org.springframework.security.oauth.provider.OAuthAuthenticationDetails;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextHierarchy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextHierarchy({
        @ContextConfiguration(name = "root", locations = "classpath:conf/spring/root-context.xml"),
        @ContextConfiguration(name = "api", locations = "classpath:conf/spring/api-servlet/api-servlet.xml")
})
@WebAppConfiguration
public abstract class AbstractQuandaContextTest {

    @Autowired
    protected SessionFactory sessionFactory;

    @Autowired
    private IQuandaUserDAO userDAO;

    protected QuandaUser user1;
    protected QuandaUser user2;

    @BeforeClass
    public static void setupLog4J() {
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_GLOBAL);
        String log4jconfig = "/log4j.properties";
        PropertyConfigurator.configure(AbstractQuandaContextTest.class.getResourceAsStream(log4jconfig));
    }

    @Before
    public void setUp() throws Exception {
        if (TransactionSynchronizationManager.hasResource(sessionFactory)) {
            SessionHolder sessionHolder = (SessionHolder) TransactionSynchronizationManager.unbindResource(sessionFactory);
            SessionFactoryUtils.closeSession(sessionHolder.getSession());
        }

        TransactionSynchronizationManager.bindResource(sessionFactory, new SessionHolder(sessionFactory.openSession()));
        user1 = userDAO.read(1L);
        user2 = userDAO.read(2L);
        setAuthentication(user1, false);
    }

    @After
    public void tearDown() throws Exception {
        SessionHolder sessionHolder = (SessionHolder) TransactionSynchronizationManager.unbindResource(sessionFactory);
        SessionFactoryUtils.closeSession(sessionHolder.getSession());
        SecurityContextHolder.clearContext();
    }

    public static void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    public static void setAuthentication(QuandaUser player, boolean secure) {
        SecurityContextImpl securityContext = new SecurityContextImpl();
        ConsumerCredentials consumerCredentials = new ConsumerCredentials(((ConsumerDetails) player).getConsumerKey(), "signature", "HMAC-SHA1", "baseString", null);
        ConsumerAuthentication authentication = new ConsumerAuthentication((ConsumerDetails) player, consumerCredentials);
        authentication.setAuthenticated(true);
        MockHttpServletRequest servletRequest = new MockHttpServletRequest();
        if (secure) {
            servletRequest.setProtocol("https");
            servletRequest.setScheme("https");
            servletRequest.setSecure(true);
        }
        OAuthAuthenticationDetails authenticationDetails = new OAuthAuthenticationDetails(servletRequest, (ConsumerDetails) player);
        authentication.setDetails(authenticationDetails);
        securityContext.setAuthentication(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    public void restartSession() {
        SessionHolder sessionHolder = (SessionHolder) TransactionSynchronizationManager.unbindResource(sessionFactory);
        sessionHolder.getSession().flush();
        SessionFactoryUtils.closeSession(sessionHolder.getSession());
        TransactionSynchronizationManager.bindResource(sessionFactory, new SessionHolder(sessionFactory.openSession()));
    }
}