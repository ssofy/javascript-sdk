SSOfy Javascript SDK
=============
#### Official [SSOfy](https://www.ssofy.com) Javascript SDK.

**Built for use in browsers and Node.js applications.**

Read the full [documentation](https://www.ssofy.com/docs/SDK/Javascript/Installation/) at SSOfy Knowledge Base.

<img src="docs/img/logo.png"/>

## Installation

### CDN
```html
<script src="https://cdn.jsdelivr.net/gh/ssofy/javascript-sdk/dist/ssofy.min.js"></script>

<!-- UMD Version -->
<script src="https://cdn.jsdelivr.net/gh/ssofy/javascript-sdk/dist/ssofy.umd.min.js"></script>
```

### Installing via NPM

```bash
npm i @ssofy/javascript-sdk -S
```

### Installing via YARN

```bash
yarn add @ssofy/javascript-sdk
```

## Usage

### Client Configuration

#### Browser:
```javascript
const client = new SSOfy.OAuth2Client({
    url: 'https://YOUR-SSO-DOMAIN',
    clientId: 'sandbox',
    redirectUri: 'https://CURRENT-DOMAIN/callback'
    scopes: ['*'],
    locale: 'en',
    // state: '', //optional
    stateStore: new SSOfy.LocalStorage(),
    stateTtl: 30 * 24 * 60 * 60,
});
```

#### ES6 / Typescript:
```typescript
import { OAuth2Config, OAuth2Client, Storage, FileStorage } from "@ssofy/javascript-sdk";
import fs from "fs";

const storagePath = fs.mkdtempSync('/tmp/');
const stateStore = new FileStorage(storagePath);

const config = new OAuth2Config({
    url: 'https://YOUR-SSO-DOMAIN',
    clientId: 'sandbox',
    clientSecret: 'sandbox',
    redirectUri: 'https://CURRENT-DOMAIN/callback'
    pkceVerification: true,
    scopes: ['*'],
    locale: 'en',
    // state: '', //optional
    stateStore: <Storage>stateStore,
    stateTtl: 30 * 24 * 60 * 60,
});

const client = new OAuth2Client(config);
```

### Generate Login Url

#### Auth Code Flow
```javascript
const customAuthorizationUrl = null; // optional
const nextUri = null; // optional

const stateData = await client.initAuthCodeFlow(customAuthorizationUrl, nextUri);

// redirect to the login page
window.location.href = stateData.authorizationUri;
```

#### Implicit Flow
```javascript
const customAuthorizationUrl = null; // optional
const nextUri = null; // optional

const stateData = await client.initImplicitFlow(customAuthorizationUrl, nextUri);

// redirect to the login page
window.location.href = stateData.authorizationUri;
```

### Handling Callbacks
```javascript
// create json payload from url parameters
const parameters = SSOfy.UrlHelper.getParameters(window.location.href);

// handle the callback
const stateData = await client.handleCallback(parameters);

// store the last login state identifier somewhere for future use
localStorage.setItem('state', stateData.state);

if (stateData.nextUri) {
    // Hint: /optional-uri-to-redirect-next
    window.location.href = stateData.nextUri;
}
```

### Get Access Token
```javascript
const state = localStorage.getItem('state');

const accessToken = await client.getAccessToken(state);
```

### Renew Access Token
In most cases, it's not necessary to call this method as `getAccessToken()` refreshes the token automatically upon expiration.
However, should you require an earlier token refresh, this method can be used in such instances.

```javascript
const state = localStorage.getItem('state');

const accessToken = await client.renewAccessToken(state);
```

### Logout Locally

```javascript
await client.destroy(state);
```

### Logout Globally (SLO)

```javascript
await client.destroy(state);

// logout from this device
window.location.href = config.logoutUrl('URI-TO-REDIRECT-AFTER-LOGOUT')

// logout from all devices (SLO)
window.location.href = config.logoutEverywhereUrl('URI-TO-REDIRECT-AFTER-LOGOUT')
```

### Get User Info

```javascript
const state = localStorage.getItem('state');

const user = await client.getUserInfo(state);
```

## Support

Feel free to reach support with any questions regarding the integration or reporting issues.
Our technical experts are available around the clock to conduct investigations and provide
the highest quality product and service support as quickly as possible.

## Author

**SSOfy** and derivatives are by [Cubelet Ltd](https://cubelet.co.uk).

## License

The MIT License (MIT). Please see [License](LICENSE) File for more information.
