// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

class AlertDialog extends Component {

  render() {
    return (
      <Dialog open={this.props.value !== null}
        maxWidth={'xs'}
        onClose={() => this.props.onClose()}
        >
        <DialogContent style={{textAlign: 'center'}}>
          <Typography variant="h6">
            {this.props.value}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onClose()} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AlertDialog;
