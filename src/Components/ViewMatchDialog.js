// REACT
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});


class ViewMatchDialog extends Component {

  render() {
    const { classes } = this.props;
    return (
      <Dialog open={this.props.value !== null}
        aria-labelledby="match-dialog-title"
        fullWidth={true}
        maxWidth={'md'}
        scroll={'body'}
        onClose={this.props.onClose}
        >
        <DialogContent>
          <Paper className={classes.paper} elevation={2}>
            <Typography gutterBottom variant="h5">
              {this.props.value ? this.props.matchStore[this.props.value.hashKey].title : ""}
            </Typography>
            <Typography gutterBottom variant="body2">
              {this.props.value ? this.props.matchStore[this.props.value.hashKey].body.split("\n").map((i, key) => {
                    return <Typography key={key}>{i}</Typography>;
              }) : ""}
            </Typography>
          </Paper>
          <Paper className={classes.paper} elevation={2}>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}><Typography variant="body2">Name</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2">{this.props.value ? this.props.matchStore[this.props.value.userName].name : ""}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2">Email</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2">{this.props.value ? this.props.matchStore[this.props.value.userName].email : ""}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2">Phone</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2">{this.props.value ? this.props.matchStore[this.props.value.userName].phone : ""}</Typography></Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ViewMatchDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewMatchDialog);
