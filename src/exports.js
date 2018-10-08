export default {
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'ap-southeast-2:f47b0e65-9876-4dc8-8c34-a5975f78e2e6',

        // REQUIRED - Amazon Cognito Region
        region: 'ap-southeast-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'ap-southeast-2_9p8Tl00qj',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '34oe6g68k70r6o1hhplsal1456',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false
    }
}
