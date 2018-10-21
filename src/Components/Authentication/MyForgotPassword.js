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
import { ForgotPassword } from 'aws-amplify-react';

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

export default class MyForgotPassword extends ForgotPassword {
  constructor(props) {
      super(props);

      this._validAuthStates = ['forgotPassword'];
      this.state = {
        delivery: null,
        loading: false,
        alert: null,
       };

      this.send = this.send.bind(this);
      this.submit = this.submit.bind(this);
  }

  send() {
      this.setState({ loading: true });
      const { username } = this.state;
      if (!username) {
          this.error('Username cannot be empty');
          return;
      }
      Auth.forgotPassword(username)
          .then(data => {
              this.setState({ loading: false });
              this.setState({ delivery: data.CodeDeliveryDetails });
          })
          .catch(err => {
            this.setState({ alert: err.message });
            this.setState({ loading: false });
          });
  }

  submit() {
      this.setState({ loading: true });
      const { username, code, password } = this.state;
      Auth.forgotPasswordSubmit(username, code, password)
          .then(data => {
              this.setState({ loading: false });
              this.changeState('signIn');
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
            <Dialog open={this.state.delivery === null}
              hideBackdrop
              fullWidth={true}
              maxWidth={'sm'}
              >
              <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
              <DialogContent>
                <TextField
                  required
                  label="Email"
                  fullWidth={true}
                  margin="normal"
                  variant="outlined"
                  value={this.state.username}
                  InputLabelProps={{shrink: true}}
                  onChange={this.handleChange('username')}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  color="secondary"
                  onClick={() => this.changeState('signIn')}
                  >
                  Back to Sign In
                </Button>
                <Button
                  color="primary"
                  onClick={this.send}
                  disabled={!this.state.username}
                  >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={this.state.delivery !== null}
              hideBackdrop
              fullWidth={true}
              maxWidth={'sm'}
              >
              <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
              <DialogContent>
                <TextField
                  required
                  label="Confirmation Code"
                  fullWidth={true}
                  margin="normal"
                  variant="outlined"
                  value={this.state.code}
                  InputLabelProps={{shrink: true}}
                  onChange={this.handleChange('code')}
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
                  color="secondary"
                  onClick={() => this.changeState('signIn')}
                  >
                  Back to Sign In
                </Button>
                <Button
                  color="primary"
                  onClick={this.submit}
                  disabled={!this.state.username}
                  >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <LoadingDialog open={this.state.loading}/>
            <AlertDialog
              value={this.state.alert}
              onClose={() => this.setState({ alert: null })}
              />
          </MuiThemeProvider>
      )
  }
}
