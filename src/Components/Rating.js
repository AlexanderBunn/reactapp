import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  rating: {
    color: orange[500],
    flex: 1,
  },
});

class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: this.props.value,
      bkpRating: 0,
    };
  }

  rate(newRating) {
    if (!this.props.disabled) {
      this.setState({
        rating: newRating,
        bkpRating: newRating
      });
      this.props.onChange(this.props.name, newRating + 1);
    }
  }

  openStarView(newRating) {
    this.setState({ bkpRating: this.state.rating });
    this.setState({ rating: newRating });
  }

  closeStarView() {
    this.setState({ rating: this.state.bkpRating });
  }

  render() {
    const { classes } = this.props;
    var stars = [];
    for(var i = 0; i < 5; i++) {
      var bool = false;
      if (this.state.rating >= i && this.state.rating != null) {
        bool = true;
      }
      stars.push(
        <Checkbox
          key={"star-" + i.toString()}
          disabled={this.props.disabled}
          checked={bool}
          onClick={this.rate.bind(this, i)}
          onMouseOver={this.openStarView.bind(this, i)}
          onMouseOut={this.closeStarView.bind(this, i)}
          icon={ <StarBorder className={classes.rating} /> }
          checkedIcon={ <Star className={classes.rating} /> }
        />
      );
    }
    return (
       <Grid container spacing={8} alignItems="center">
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
          <Typography variant="h6" color="inherit" >{this.props.name}</Typography>
        </Grid>
        <Grid item xs={6}>
          {stars}
        </Grid>
      </Grid>
    );
  }
}

Rating.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rating);
