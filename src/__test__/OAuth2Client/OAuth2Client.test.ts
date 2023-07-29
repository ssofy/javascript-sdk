import {OAuth2Config} from "../../OAuth2Config";
import {OAuth2Client} from "../../OAuth2Client";
import {Storage} from "../../Storage/Storage";
import {UrlHelper} from "../../Helpers/UrlHelper";
import {MemoryStorage} from "../../Storage/MemoryStorage";

describe('Client Test', () => {
    const stateStore = new MemoryStorage();

    const config = new OAuth2Config({
        url: 'http://sandbox.us.ssofy.local',
        clientId: 'sandbox',
        clientSecret: 'sandbox',
        scopes: ['*'],
        redirectUri: 'https://oauthdebugger.com/debug',
        stateStore: <Storage>stateStore,
    });

    const client = new OAuth2Client(config);

    test.skip('auth code flow initiation', async () => {
        jest.setTimeout(30000);

        const state = await client.initAuthCodeFlow('http://localhost/oauth/continue');
        console.log(state);

        expect(state.state).toBeDefined();
        expect(state.authorizationUri).toBeDefined();
    });

    test.skip('implicit flow initiation', async () => {
        jest.setTimeout(30000);

        const state = await client.initImplicitFlow('http://localhost/oauth/continue');
        console.log(state);

        expect(state.state).toBeDefined();
        expect(state.authorizationUri).toBeDefined();
    });

    test.skip('callback handle', async () => {
        jest.setTimeout(30000);

        const state = '9zSTfBO3p1';

        const payload = UrlHelper.getParameters(`https://oauthdebugger.com/debug?code=018998dcddc578668890b15277010ea7469b2cd11e9a45fc9b30167c6e6754d0698987de47324da2a400c90c0a9782e2&state=${state}`);
        console.log(payload);

        const stateData = await client.handleCallback(state, payload);
        console.log(stateData.token);

        expect(true).toBeTruthy();
    });

    test.skip('refresh token', async () => {
        jest.setTimeout(30000);

        const state = await client.getAccessToken('9zSTfBO3p1');
        console.log(state);

        expect(true).toBeTruthy();
    });

    test.skip('refresh user info', async () => {
        jest.setTimeout(30000);

        let user;

        user = await client.getUserInfo('9zSTfBO3p1');
        console.log(user);

        user = await client.refreshUserInfo('9zSTfBO3p1');
        console.log(user);

        expect(true).toBeTruthy();
    });
});
