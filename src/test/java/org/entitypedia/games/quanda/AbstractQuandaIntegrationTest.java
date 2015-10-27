package org.entitypedia.games.quanda;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClients;
import org.entitypedia.games.quanda.client.IQuandaClient;
import org.entitypedia.games.quanda.client.QuandaClient;
import org.junit.AfterClass;
import org.junit.BeforeClass;

/**
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
public abstract class AbstractQuandaIntegrationTest {

    protected static HttpClient httpClient = HttpClients.createDefault();

    protected static IQuandaClient client;
    protected static IQuandaClient userClient;
    protected static IQuandaClient anonClient;
    private static final String uid = "pgf1";
    private static final String password = "G5bMmFKTUCqHHEPOBO3G";
    private static final String uid2 = "pgf2";
    private static final String password2 = "wlAjuIFR0XVad2h6js3v";

    private static final String TEST_API_ENDPOINT = "http://localhost:9638/quanda/webapi/";

    @BeforeClass
    public static void setup() {
        client = new QuandaClient(uid, password);
        ((QuandaClient) client).setHttpClient(httpClient);
        ((QuandaClient) client).setApiEndpoint(TEST_API_ENDPOINT);
        userClient = new QuandaClient(uid2, password2);
        ((QuandaClient) userClient).setHttpClient(httpClient);
        ((QuandaClient) userClient).setApiEndpoint(TEST_API_ENDPOINT);
        anonClient = new QuandaClient("", "");
        ((QuandaClient) anonClient).setHttpClient(httpClient);
        ((QuandaClient) anonClient).setSignConnection(false);
        ((QuandaClient) anonClient).setApiEndpoint(TEST_API_ENDPOINT);
    }

    @AfterClass
    public static void teardown() {
        client = null;
        userClient = null;
        anonClient = null;
    }
}