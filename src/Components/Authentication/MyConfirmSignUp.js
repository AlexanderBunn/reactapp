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
import { ConfirmSignUp } from 'aws-amplify-react';

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

export default class MyConfirmSignUp extends ConfirmSignUp {
  constructor(props) {
      super(props);

      this._validAuthStates = ['confirmSignUp'];
      this.state = {
          username: null,
          code: null,
          error: null,
          loading: false,
          alert: null,
      }

      this.confirm = this.confirm.bind(this);
      this.resend = this.resend.bind(this);
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
          <DialogTitle id="form-dialog-title">Confrim SignUp</DialogTitle>
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
              label="Confirmation Code"
              fullWidth={true}
              margin="normal"
              variant="outlined"
              value={this.state.code}
              InputLabelProps={{shrink: true}}
              onChange={this.handleChange('code')}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => this.changeState('signUp')}
              >
              Back
            </Button>
            <Button
              color="primary"
              onClick={this.confirm}
              disabled={!this.state.code}
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
      );
  }
}
