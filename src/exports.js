import config from './config'
import { Auth } from 'aws-amplify';
export default {
  Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: config.cognito.IDENTITY_POOL_ID,

      // REQUIRED - Amazon Cognito Region
      region: config.cognito.REGION,

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: config.cognito.USER_POOL_ID,

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: true
  },
  API: {
    endpoints: [
      {
        name: config.apiGateway.NAME,
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
        custom_header: async() => {
           return { Authorization: (await Auth.currentSession()).idToken.jwtToken }
        }
      },
    ]
  }
}
