import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  rating: {
    color: orange[500],
  },
  formControl: {
    width: 'auto',
    textAlign: 'center',
  }
});

class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      bkpRating: 0,
    };
  }

  rate(newRating) {
    this.setState({
      rating: newRating,
      bkpRating: newRating
    });
    this.props.onChange(this.props.name, newRating);
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
        <FormControlLabel
          control={
            <Checkbox
              checked={bool}
              onClick={this.rate.bind(this, i)}
              onMouseOver={this.openStarView.bind(this, i)}
              onMouseOut={this.closeStarView.bind(this, i)}
              icon={
                <StarBorder
                  className={classes.rating}
                />
              }
              checkedIcon={
                <Star
                  className={classes.rating}
                />
              }
            />
          }
        />
      );
    }
    return (
      <FormControl className={classes.formControl}>
        <FormGroup
          aria-label="relevance"
          name="relevance"
          row
        >
          {stars}
          </FormGroup>
        </FormControl>
    );
  }
}

Rating.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rating);
