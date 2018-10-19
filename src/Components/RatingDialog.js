// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from './Rating'

class RatingDialog extends Component {

  render() {
    return (
      <Dialog open={this.props.open}
        aria-labelledby="rating-dialog-title"
        maxWidth={'sm'}
        scroll={'body'}
        >
        <DialogTitle id="rating-dialog-title">Rating</DialogTitle>
        <DialogContent>
          <Rating value={0} name={this.props.value ? this.props.labels[this.props.value.itemType][0] : null} onChange={this.props.onChange}/>
          <Rating value={0} name={this.props.value ? this.props.labels[this.props.value.itemType][1] : null} onChange={this.props.onChange}/>
          <Rating value={0} name={this.props.value ? this.props.labels[this.props.value.itemType][2] : null} onChange={this.props.onChange}/>
          <Rating value={0} name={this.props.value ? this.props.labels[this.props.value.itemType][3] : null} onChange={this.props.onChange}/>
          <Rating value={0} name={this.props.value ? this.props.labels[this.props.value.itemType][4] : null} onChange={this.props.onChange}/>
        </DialogContent>
        <DialogActions>
        <Button onClick={this.props.onSave()} color="primary">
          Submit
        </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RatingDialog;
