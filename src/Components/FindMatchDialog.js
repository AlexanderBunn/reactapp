// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import AlertDialog from './AlertDialog';
import LoadingDialog from './LoadingDialog';
import RatingDialog from './RatingDialog';

class FindMatchDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alert: null,
      target: null,
      response: null
    }
  }

  handleGoodMatch = () => {
    let searcher = this.props.target;
    let searcherMatch = {"userName": searcher.userName, "hashKey": searcher.hashKey};
    let searchee = this.props.response;
    let searcheeMatch = {"userName": searchee.userName, "hashKey": searchee.hashKey};
    let upDown = searchee.upDown ? searchee.upDown : { "up" : 0, "down" : 0};
    upDown.up = upDown.up + 1;
    searchee.upDown = upDown;
    // HAVE THEY MATCHED ME
    if (searcher.potentialMatches && searcher.potentialMatches.filter(el => el.hashKey === searchee.hashKey)) {
      // THEY ARE NOW A FULL MATCH
      searcher.potentialMatches.splice(searcher.potentialMatches.indexOf(searcheeMatch), 1);
      searcher.matches = searcher.matches ? searcher.matches.concat(searcheeMatch) : [searcheeMatch];
      searchee.matches = searchee.matches ? searchee.matches.concat(searcherMatch) : [searcherMatch];
      this.props.onMatch(searcheeMatch);
    } else {
      // THEY ARE NOW A POTENTIAL MATCH
      searchee.potentialMatches = searchee.potentialMatches ? searchee.potentialMatches.concat(searcherMatch) : [searcherMatch];
    }
    this.setState({ target: searcher});
    this.setState({ response: searchee});
    this.setState({ rating: true });
  }
  handleBadMatch = () => {
    let searcher = this.props.target;
    let searcherMatch = {"userName": searcher.userName, "hashKey": searcher.hashKey};
    let searchee = this.props.response;
    let searcheeMatch = {"userName": searchee.userName, "hashKey": searchee.hashKey};
    if (searchee.potentialMatches && searchee.potentialMatches.includes(searcherMatch)) {
      searchee.potentialMatches.splice(searchee.potentialMatches.indexOf(searcherMatch), 1);
    }
    let upDown = searchee.upDown ? searchee.upDown : { "up" : 0, "down" : 0};
    upDown.down = upDown.down + 1;
    searchee.upDown = upDown;
    this.setState({ target: searcher});
    this.setState({ response: searchee});
    this.setState({ rating: true });
  }
  handleRating = (name, value) => {
    let searchee = this.state.response;
    let rating = searchee[name] ? searchee[name] : { "avg" : 0, "count" : 0};
    rating.avg = ((rating.avg * rating.count) + value ) / (rating.count + 1);
    rating.count = rating.count + 1;
    searchee[name] = rating;
    this.setState({ response: searchee });
  }
  handleSaveMatch = () => {
    let searcher = this.state.target;
    let searchee = this.state.response;
    searcher.seen = searcher.seen ? searcher.seen.concat(searchee.hashKey) : [searchee.hashKey];
    this.setState({ target: searcher });
    this.props.onSave(searcher);
    this.props.onSave(searchee);
    this.setState({ rating: false });
    this.props.onReset(searcher);
  }

  render() {
    return (
      <Dialog open={this.props.target !== null  && this.props.response !== null}
        aria-labelledby="match-dialog-title"
        fullWidth={true}
        maxWidth={'md'}
        scroll={'body'}
        onClose={() => this.props.onReset(null)}
        >
        <DialogTitle id="match-dialog-title">Find {this.props.response ? this.props.response.itemType : ""} </DialogTitle>
        <DialogContent>
          {(this.props.response ? this.props.response.body : " ").split("\n").map((i, key) => {
                return <Typography variant="body2" key={key}>{i}</Typography>;
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleBadMatch} color="secondary">
            <ThumbDownIcon />
          </Button>
          <Button onClick={this.handleGoodMatch} color="primary">
            <ThumbUpIcon />
          </Button>
        </DialogActions>
        <RatingDialog
          open={this.state.rating}
          value={this.state.response}
          labels={this.props.labels}
          onChange={(name, value) => this.handleRating}
          onSave={() => this.handleSaveMatch}
          />
        <AlertDialog
          value={this.state.alert}
          onClose={() => this.setState({ alert: null })}
          />
        <LoadingDialog open={this.state.loading}/>
      </Dialog>
    );
  }
}

export default FindMatchDialog;
