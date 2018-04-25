let db = {
    accessTokens: [
    ],
    refreshTokens: [
    ],
    authCodes: [
    ],
    clients: [
        {
            id: 'demo_client',
            secret: 'demo_secret',
            user_id: 'demo_user',
            redirect_uris: ['http://localhost/oauth'],
            grants: ['authorization_code', 'client_credentials']
        }
    ],
    users: [
        {
            id: 'demo_user',
            name: 'Demo User',
            password: 'demo_password'
        }
    ]
};

const DBHelper = {
    saveAccessToken: async accessToken => {
        db.accessTokens.push(accessToken);
        return accessToken;
    },
    saveRefreshToken: async refreshToken => {
        db.refreshTokens.push(refreshToken);
        return refreshToken;
    },
    saveAuthorizationCode: async authCode => {
        db.authCodes.push(authCode);
        return authCode;
    },
    queryAuthorizationCode: async authorizationCode => {
        return db.authCodes.find(function (element) {
            return element.authorization_code === authorizationCode;
        });
    },
    queryAccessToken: async accessToken => {
        return db.accessTokens.find(function (element) {
            return element.access_token === accessToken;
        });
    },
    queryRefreshToken: async refreshToken => {
        return db.refreshTokens.find(function (element) {
            return element.refresh_token === refreshToken;
        });
    },
    queryClient: async params => {
        return db.clients.find(function (element) {
            return element.id === params.client_id && (params.client_secret === undefined || element.secret === params.client_secret);
        });
    },
    queryUser: async userId => {
        return db.users.find(function (element) {
            return element.id === userId;
        });
    },
    deleteRefreshToken: async refreshToken => {
        let index = db.refreshTokens.findIndex(function (element) {
            return element.refresh_token === refreshToken;
        });
        if (index > -1) {
            db.refreshTokens.splice(index, 1);
            return true;
        }
        return false;
    },
    deleteAuthorizationCode: async authorizationCode => {
        let index = db.authCodes.findIndex(function (element) {
            return element.authorization_code === authorizationCode;
        });
        if (index > -1) {
            db.authCodes.splice(index, 1);
            return true;
        }
        return false;
    }
};

module.exports = DBHelper;