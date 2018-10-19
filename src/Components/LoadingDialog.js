// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';


class LoadingDialog extends Component {

  render() {
    return (
      <Dialog open={this.props.open}
        maxWidth={'xs'}
        >
        <DialogContent style={{textAlign: 'center'}}>
        <CircularProgress color="primary" />
        </DialogContent>
      </Dialog>
    );
  }
}

export default LoadingDialog;
