/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

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

import LoadingDialog from '../LoadingDialog';
import AlertDialog from '../AlertDialog';

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
            error: null,
            loading: false,
            alert: null,
        }
        this.checkContact = this.checkContact.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    signIn() {
        const { username, password } = this.state;
        this.setState({ loading: true });
        Auth.signIn(username, password)
            .then(user => {
                const requireMFA = (user.Session !== null);
                if (user.challengeName === 'SMS_MFA') {
                    this.changeState('confirmSignIn', user);
                } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    this.changeState('requireNewPassword', user);
                } else {
                    this.checkContact(user);
                }
                this.setState({ loading: false });
            })
            .catch(err => {
              this.setState({ alert: err.message });
              this.setState({ loading: false });
            });
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
          hideBackdrop
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
              InputLabelProps={{shrink: true}}
              onChange={this.handleChange('username')}
            />
            <TextField
              required
              label="Password"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              type="password"
              InputLabelProps={{shrink: true}}
              value={this.state.password}
              onChange={this.handleChange('password')}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => this.changeState('signUp')}
              >
              Create An Account
            </Button>
            <Button
              color="secondary"
              onClick={() => this.changeState('forgotPassword')}
              >
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
        <LoadingDialog open={this.state.loading}/>
        <AlertDialog
          value={this.state.alert}
          onClose={() => this.setState({ alert: null })}
          />
      </MuiThemeProvider>
    );
  }
}
