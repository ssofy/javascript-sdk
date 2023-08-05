import {OAuth2Config} from "../../OAuth2Config";
import {OAuth2Client} from "../../OAuth2Client";
import {Storage} from "../../Storage/Storage";
import {UrlHelper} from "../../Helpers/UrlHelper";
import {FileStorage} from "../../Storage/FileStorage";

describe('OAuth2Client Test', () => {
    const storagePath = '/tmp/';
    const stateStore = new FileStorage(storagePath);

    const config = new OAuth2Config({
        url: 'http://sandbox.us.ssofy.local',
        clientId: 'sandbox',
        clientSecret: 'sandbox',
        scopes: ['*'],
        pkceVerification: true,
        redirectUri: 'https://oauthdebugger.com/debug',
        stateStore: <Storage>stateStore,
    });

    const client = new OAuth2Client(config);

    jest.setTimeout(5000);

    test.skip('auth code flow initiation', async () => {

        const state = await client.initAuthCodeFlow();
        console.log(state);

        expect(state.state).toBeDefined();
        expect(state.authorizationUri).toBeDefined();
    });

    test.skip('implicit flow initiation', async () => {
        const state = await client.initImplicitFlow();
        console.log(state);

        expect(state.state).toBeDefined();
        expect(state.authorizationUri).toBeDefined();
    });

    test.skip('callback handle', async () => {
        const state = 'tnhDYP9R5X';
        const code = '0189c4f6b3c17e4d97f85721961359a6955bd7cc8cd74b80b11cf4a06af4ee81513e8094a09e402193e37bc790015bca';

        const payload = UrlHelper.getParameters(`https://oauthdebugger.com/debug?code=${code}&state=${state}`);
        console.log(payload);

        const stateData = await client.handleCallback(payload);
        console.log(stateData.token);

        expect(true).toBeTruthy();
    });

    test.skip('access token', async () => {
        const state = 'tnhDYP9R5X';

        const stateData = await client.getAccessToken(state);
        console.log(stateData);

        expect(true).toBeTruthy();
    });

    test.skip('renew token', async () => {
        const state = 'tnhDYP9R5X';

        const stateData = await client.renewAccessToken(state);
        console.log(stateData);

        expect(true).toBeTruthy();
    });

    test.skip('refresh user info', async () => {
        let user;

        const state = 'tnhDYP9R5X';

        user = await client.getUserInfo(state);
        console.log(user);

        user = await client.refreshUserInfo(state);
        console.log(user);

        expect(true).toBeTruthy();
    });
});
