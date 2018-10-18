// REACT
import React, { Component } from 'react';

// MATERIAL UI
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dialog open={this.props.loading}
        maxWidth={'xs'}
        >
        <DialogContent style={{textAlign: 'center'}}>
        <CircularProgress color="primary" />
        </DialogContent>
      </Dialog>
    );
  }
}
