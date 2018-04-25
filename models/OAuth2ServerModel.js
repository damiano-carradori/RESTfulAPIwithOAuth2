const VALID_SCOPES = ['read', 'write'];
const DBHelper = require('../middleware/DBHelper');
const model = {
    getAccessToken: async accessToken => {
        let token = await DBHelper.queryAccessToken(accessToken);
        let client = await DBHelper.queryClient(token.client_id);
        let user = await DBHelper.queryUser(token.user_id);
        return {
            accessToken: token.access_token,
            accessTokenExpiresAt: token.expires_at,
            scope: token.scope,
            client: client,
            user: user
        };
    },
    getRefreshToken: async refreshToken => {
        let token = await DBHelper.queryRefreshToken(refreshToken);
        let client = await DBHelper.queryClient(token.client_id);
        let user = await DBHelper.queryUser(token.user_id);
        return {
            refreshToken: token.refresh_token,
            refreshTokenExpiresAt: token.expires_at,
            scope: token.scope,
            client: client,
            user: user
        };
    },
    getAuthorizationCode: async authorizationCode => {
        let code = await DBHelper.queryAuthorizationCode(authorizationCode);
        let client = await DBHelper.queryClient(code.client_id);
        let user = await DBHelper.queryUser(code.user_id);
        return {
            code: code.authorization_code,
            expiresAt: code.expires_at,
            redirectUri: code.redirect_uri,
            scope: code.scope,
            client: client,
            user: user
        };
    },
    getClient: async (clientId, clientSecret) => {
        let params = {client_id: clientId};
        if (clientSecret) params.client_secret = clientSecret;
        let client = await DBHelper.queryClient(params);
        return {
            id: client.id,
            redirectUris: client.redirect_uris,
            grants: client.grants,
            user_id: client.user_id
        };
    },
    getUserFromClient: async client => {
        return await DBHelper.queryUser(client.user_id);
    },
    saveToken: async (token, client, user) => {
        let access_Token = {
            access_token: token.accessToken,
            expires_at: token.accessTokenExpiresAt,
            scope: token.scope,
            client_id: client.id,
            user_id: user.id
        };
        let refresh_Token = {
            refresh_token: token.refreshToken,
            expires_at: token.refreshTokenExpiresAt,
            scope: token.scope,
            client_id: client.id,
            user_id: user.id
        };
        let accessToken = await DBHelper.saveAccessToken(access_Token);
        let refreshToken = await DBHelper.saveRefreshToken(refresh_Token);
        return {
            accessToken: accessToken.access_token,
            accessTokenExpiresAt: accessToken.expires_at,
            refreshToken: refreshToken.refresh_token,
            refreshTokenExpiresAt: refreshToken.expires_at,
            scope: accessToken.scope,
            client: {id: accessToken.client_id},
            user: {id: accessToken.user_id}
        };
    },
    saveAuthorizationCode: async (code, client, user) => {
        let authCode = {
            authorization_code: code.authorizationCode,
            expires_at: code.expiresAt,
            redirect_uri: code.redirectUri,
            scope: code.scope,
            client_id: client.id,
            user_id: user.id
        };
        let authorizationCode = await DBHelper.saveAuthorizationCode(authCode);
        return {
            authorizationCode: authorizationCode.authorization_code,
            expiresAt: authorizationCode.expires_at,
            redirectUri: authorizationCode.redirect_uri,
            scope: authorizationCode.scope,
            client: {id: authorizationCode.client_id},
            user: {id: authorizationCode.user_id}
        };
    },
    revokeToken: async token => {
        return await DBHelper.deleteRefreshToken(token.refreshToken);
    },
    revokeAuthorizationCode: async code => {
        return await DBHelper.deleteAuthorizationCode(code.authorizationCode);
    },
    validateScope: async (user, client, scope) => {
        if (!scope.split(' ').every(s => VALID_SCOPES.indexOf(s) >= 0)) {
            return false;
        }
        return scope;
    },
    verifyScope: async (token, scope) => {
        if (!token.scope) {
            return false;
        }
        let requestedScopes = scope.split(' ');
        let authorizedScopes = token.scope.split(' ');
        return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    }
};

module.exports = model;