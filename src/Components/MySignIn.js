import React from 'react';
import { Auth, Logger } from 'aws-amplify';
import { SignIn } from 'aws-amplify-react';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// EDIT DIALOG
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const logger = new Logger('SignIn');

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  }
});

export default class MySignIn extends SignIn {
    constructor(props) {
        super(props);

        this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
        this.state = {
            username: "",
            password: "",
            error: null
        }
        this.checkContact = this.checkContact.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    signIn() {
        const { username, password } = this.state;
        logger.debug('Sign In for ' + username);
        Auth.signIn(username, password)
            .then(user => {
                logger.debug(user);
                const requireMFA = (user.Session !== null);
                if (user.challengeName === 'SMS_MFA') {
                    this.changeState('confirmSignIn', user);
                } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    logger.debug('require new password', user.challengeParam);
                    this.changeState('requireNewPassword', user);
                } else {
                    this.checkContact(user);
                }
            })
            .catch(err => this.error(err));
    }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  showComponent() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={true}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth={'sm'}
          >
          <DialogTitle id="form-dialog-title">Sign in to your account</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              label="Email"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              value={this.state.username}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleChange('username')}
            />
            <TextField
              required
              label="Password"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.password}
              onChange={this.handleChange('password')}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary">
              Create An Account
            </Button>
            <Button color="secondary">
              Forgot Password
            </Button>
            <Button
              disabled={!this.state.username || !this.state.password}
              color="primary"
              onClick={this.signIn}
              >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
