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
import { SignUp } from 'aws-amplify-react';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

export default class MySignUp extends SignUp {
  constructor(props) {
      super(props);

      this._validAuthStates = ['signUp'];
      this.state = {
          username: null,
          password: null,
          confirmPassword: null,
          email: null,
          loading: false,
          alert: null,
      }
      this.signUp = this.signUp.bind(this);
  }

  signUp() {
      this.setState({ loading: true });
      const { username, password, email, phone_number } = this.state;
      Auth.signUp(username, password, username)
          .then(data => {
              this.setState({ loading: false });
              this.changeState('confirmSignUp', username);
          })
          .catch(err => {
            this.setState({ alert: err.message });
            this.setState({ loading: false });
          });
  }

  confirm() {
      this.setState({ loading: true });
      const { username, code } = this.state;
      Auth.confirmSignUp(username, code)
          .then(data => {
            this.changeState('signedUp');
            this.setState({ loading: false });
          })
          .catch(err => {
            this.setState({ alert: err.message });
            this.setState({ loading: false });
          });
  }

  resend() {
      const { username } = this.state;
      Auth.resendSignUp(username)
          .catch(err => { this.setState({ alert: err.message }) });
  }

  componentWillReceiveProps(nextProps) {
      const username = nextProps.authData;
      if (username && !this.state.username) { this.setState({ username }); }
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
              <DialogTitle id="form-dialog-title">Create a new account</DialogTitle>
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
                <TextField
                  required
                  label="Confirm Password"
                  fullWidth={true}
                  margin="normal"
                  variant="outlined"
                  type="password"
                  InputLabelProps={{shrink: true}}
                  value={this.state.confirmPassword}
                  error={this.state.confirmPassword !== this.state.password}
                  onChange={this.handleChange('confirmPassword')}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  color="secondary"
                  onClick={() => this.changeState('signIn')}
                  >
                  Back
                </Button>
                <Button
                  color="primary"
                  onClick={() => this.changeState('confirmSignUp')}
                  >
                  Enter Code
                </Button>
                <Button
                  disabled={!this.state.username || !this.state.password || (this.state.password !== this.state.confirmPassword)}
                  color="primary"
                  onClick={this.signUp}
                  >
                  Sign Up
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
