// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Rating from './Rating'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import Typography from '@material-ui/core/Typography';

class FeedbackDialog extends Component {

  render() {
    return (
      <Dialog open={this.props.value !== null}
        aria-labelledby="feedback-dialog-title"
        maxWidth={'sm'}
        scroll={'body'}
        onClose={this.props.onClose}
        >
        <DialogTitle id="match-dialog-title">Feedback</DialogTitle>
        <DialogContent>
          <Rating value={this.props.value && this.props.value[this.props.labels[this.props.value.itemType][0]] ? this.props.value[this.props.labels[this.props.value.itemType][0]].avg : 1} name={this.props.value ? this.props.labels[this.props.value.itemType][0] : null} disabled={true}/>
          <Rating value={this.props.value && this.props.value[this.props.labels[this.props.value.itemType][1]] ? this.props.value[this.props.labels[this.props.value.itemType][1]].avg : 2} name={this.props.value ? this.props.labels[this.props.value.itemType][1] : null} disabled={true}/>
          <Rating value={this.props.value && this.props.value[this.props.labels[this.props.value.itemType][2]] ? this.props.value[this.props.labels[this.props.value.itemType][2]].avg : 1} name={this.props.value ? this.props.labels[this.props.value.itemType][2] : null} disabled={true}/>
          <Rating value={this.props.value && this.props.value[this.props.labels[this.props.value.itemType][3]] ? this.props.value[this.props.labels[this.props.value.itemType][3]].avg : 2} name={this.props.value ? this.props.labels[this.props.value.itemType][3] : null} disabled={true}/>
          <Rating value={this.props.value && this.props.value[this.props.labels[this.props.value.itemType][4]] ? this.props.value[this.props.labels[this.props.value.itemType][4]].avg : 2} name={this.props.value ? this.props.labels[this.props.value.itemType][4] : null} disabled={true}/>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={2}></Grid>
             <Grid item xs={2}>
              <ThumbsUpDownIcon />
             </Grid>
             <Grid item xs={2}></Grid>
             <Grid item xs={1}>
              <ThumbDownIcon />
             </Grid>
             <Grid item xs={2}>
               <Typography variant="h6" color="inherit" >
                {this.props.value && this.props.value.upDown ? this.props.value.upDown.down : 0}
               </Typography>
             </Grid>
             <Grid item xs={1}>
              <ThumbUpIcon />
             </Grid>
             <Grid item xs={2}>
               <Typography variant="h6" color="inherit" >
                {this.props.value && this.props.value.upDown ? this.props.value.upDown.up : 0}
               </Typography>
             </Grid>
           </Grid>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FeedbackDialog;
