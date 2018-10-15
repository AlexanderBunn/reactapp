// REACT
import React, { Component } from 'react';
import './App.css';

// MATERIAL UI
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// APP BAR
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CloseIcon from '@material-ui/icons/Close';

// DRAWER
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

// DRAWER LIST
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import ViewJobsIcon from '@material-ui/icons/Assignment';
// import ViewResumesIcon from '@material-ui/icons/AssignmentInd';
import ViewIcon from '@material-ui/icons/AssignmentInd';

// CARDS
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper'
import green from '@material-ui/core/colors/green'

// CARD ACTIONS
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';

// GRID
import Grid from '@material-ui/core/Grid';

// EDIT DIALOG
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

// MATCH DIALOG
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

// RATING DIALOG
import Rating from './Rating';

// LOADING DIALOG
import CircularProgress from '@material-ui/core/CircularProgress';

// MATCH EXPANSION PANEL
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// AMPLIFY AUTHENICATOR
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

// AWS AMPLIFY
import Amplify, { Auth, API } from 'aws-amplify';
import aws_exports from './exports';
import config from './config'
Amplify.configure(aws_exports);

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
     ...theme.typography.body2,
  },
  appBar: {
    zIndex: 100,
    flexGrow: 1,
  },
  drawerPaper: {
    zIndex: 1,
    marginTop: 60,
    width: 275,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  card: {
    minWidth: 425,
  },
  button: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  gridList: {
    paddingTop: 80,
    paddingLeft: 250,
    paddingRight: 250,
    width: '100%',
    height: '100%',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  addButtonContainer: {
    position: 'fixed',
    bottom: 40,
    paddingRight: '40%',
    paddingLeft: '40%',
    width: '20%',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  addButton: {
    pointerEvents: 'all',
  },
  rating: {
  },
  gridRow: {
    flex: 1,
  },
});

const apiName = config.apiGateway.NAME;
const ratingNames = {
  "Job" : ["Benefit", "Intrest", "Usefulness", "Rewarding", "Achievable"],
  "Resume" : ["Communication Skills", "Soft Skills", "Hard Skills", "Experience", "Qualifications"]
};

// ADD CHECKS FOR ERRORS
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suspendLoad: false,
      username: Auth.user.username,
      contactDetails: null,
      contactName: null,
      contactEmail: null,
      contactPhone: null,
      editContact: false,
      itemType: 'Resume',
      loading: false,
      anchorEl: null,
      drawer: false,
      editing: false,
      editObj: null,
      editTitle: "",
      editBody: "",
      matching: false,
      matchingTarget: null,
      matchingResponse: null,
      matchObject: null,
      curMatchViewing: null,
      rating: false,
      feedback: false,
      alert: false,
      alertMsg: null,
      items: [],
    };
    this.updateItems(this.state.itemType);
    this.checkContactDetails();
  }
  loading = (bool) => {
    this.setState({ loading: bool });
  }
  updateItems = (newType) => {
    if (!this.state.suspendLoad) {
      this.loading(true);
      API.get(apiName, '/' + newType + '/' + this.state.username).then(response => {
        this.setState({items: response.Items});
        response.Items.forEach(obj =>
          obj.matches ? (obj.matches.forEach(item => this.getMatchDetails(item))) : ""
        );
        this.loading(false);
      }).catch(err => {
        this.handleShowAlert(true, err.message);
        this.loading(false);
      });
    }
  }
  getMatch = (obj) => {
    this.loading(true);
    let target = (obj === null) ? this.state.matchingTarget : obj;
    let search = [];
    target.keyPhrases.forEach((key, i) => {
      let newSearch = {
        "common" : {
          "body" : {
          }
        }
      };
      let body = newSearch.common.body;
      body['cutoff_frequency'] = 0.001;
      body['boost'] = key.Score * 10;
      body['query'] = key.Text;
      search.push(newSearch)
    });
    let params = {
      "body" : {
        "size" : 1,
        "query": {
          "bool" : {
            "should" : search,
            "minimum_should_match" : 1,
            "boost" : 1.0
          }
        }
      }
    };
    if (target.potentialMatches) {
      params.body.query.bool["must"] = { "terms" : {"_id": target.potentialMatches.map(el => el.hashKey)} };
    }
    if (target.seen) {
      params.body.query.bool["must_not"] = { "terms" : {"_id": target.seen } };
    }
    API.post(apiName, '/' + this.state.itemType + '/Search', params).then(response => {
      if (response['error'] || response['hits']['hits'].length === 0) {
        this.loading(false);
        this.handleShowMatch(false);
        this.handleShowAlert(true, "No matches");
        console.log(response);
      } else {
        let matchObj = response['hits']['hits'][0]['_source'];
        this.setState({ matchingResponse: matchObj });
        this.loading(false);
        this.handleShowMatch(true);
      }
    }).catch(err => {
      this.loading(false);
      this.handleShowMatch(false);
      this.handleShowAlert(true, err.message);
    });
  }

  checkContactDetails = () => {
    API.get(apiName, '/Contact/' + this.state.username).then(response => {
      if (response.Item === undefined) {
        this.handleShowContactDetails(true);
        this.handleShowAlert(true, "Please update contact details");
      } else {
        this.setState({ contactDetails: response.Item });
        this.setState({ contactName: response.Item.name });
        this.setState({ contactEmail: response.Item.email });
        this.setState({ contactPhone: response.Item.phone });
      }
    }).catch(err => {
      this.handleShowAlert(true, err.message);
    });
  }
  saveContactDetails = (obj) => {
    this.loading(true);
    let params = {body: obj};
    API.put(apiName, '/Contact/' + this.state.username, params).then(response => {
      this.loading(false);
    }).catch(err => {
      this.handleShowAlert(true, err.message);
      this.loading(false);
    });
  }
  handleShowContactDetails = (bool) => {
    if (bool === false) {
      let obj = {};
      if (!this.state.contactName || !this.state.contactEmail || !this.state.contactPhone) {
        this.handleShowAlert(true, "Please fill all fields");
      } else if (this.state.contactName.length === 0 || this.state.contactEmail.length === 0 || this.state.contactPhone.length === 0) {
        this.handleShowAlert(true, "Please fill all fields");
      } else {
        obj.name = this.state.contactName;
        obj.email = this.state.contactEmail;
        obj.phone = this.state.contactPhone;
        this.setState({ contactDetails: obj });
        this.saveContactDetails(obj);
        this.setState({ editContact: false });
      }
    } else {
      if (this.state.contactDetails) {
        this.setState({ contactName: this.state.contactDetails.name});
        this.setState({ contactEmail: this.state.contactDetails.email});
        this.setState({ contactPhone: this.state.contactDetails.phone});
      }
      this.setState({ editContact: true });
    }
  }

  getMatchDetails = (matchObj) => {
    this.loading(true);
    API.get(apiName, '/Contact/' + matchObj.userName).then(response => {
      let newMatchObject = this.state.matchObject ? this.state.matchObject : {};
      newMatchObject[matchObj.userName] = response.Item;
      this.setState({ matchObject: newMatchObject });
      this.loading(false);
    }).catch(err => {
      this.handleShowAlert(true, err.message);
      this.loading(false);
    });
    API.get(apiName, '/' + this.state.itemType + '/Search/' + matchObj.hashKey).then(response => {
      let newMatchObject = this.state.matchObject ? this.state.matchObject : {};
      newMatchObject[matchObj.hashKey] = response.Item;
      this.setState({ matchObject: newMatchObject });
      this.loading(false);
    }).catch(err => {
      this.handleShowAlert(true, err.message);
      this.loading(false);
    });
  }
  handleShowMatchDetails = (matchObj) => {
    this.setState({ curMatchViewing: matchObj });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  toggleDrawer = (open) => () => {
    this.setState({drawer: open});
  };
  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };
  handleNew = () => () => {
    let newObj = {
      "itemType": this.state.itemType,
      "userName": this.state.username,
    };
    this.handleEdit(newObj);
  }
  handleEdit = (obj) => {
    this.setState({ editObj: obj });
    this.setState({ editTitle: obj.title });
    this.setState({ editBody: obj.body });
    this.setState({ editing: true });
  }
  handleStartMatch = (obj) => {
    this.setState({ matchingTarget: obj });
    this.getMatch(obj);
  }
  handleShowMatch = (bool) => {
    this.setState({ matching: bool });
    if (bool === false) {
      this.setState({ matchingTarget: null });
      this.setState({ matchingResponse: null });
    }
  }
  handleGoodMatch = () => {
    let searcher = this.state.matchingTarget;
    let searcherMatch = {"userName": searcher.userName, "hashKey": searcher.hashKey};
    let searchee = this.state.matchingResponse;
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
    } else {
      // THEY ARE NOW A POTENTIAL MATCH
      searchee.potentialMatches = searchee.potentialMatches ? searchee.potentialMatches.concat(searcherMatch) : [searcherMatch];
    }
    this.setState({ matchingTarget: searcher});
    this.setState({ matchingResponse: searchee});
    this.handleShowRating(true);
  }
  handleBadMatch = () => {
    let searcher = this.state.matchingTarget;
    let searcherMatch = {"userName": searcher.userName, "hashKey": searcher.hashKey};
    let searchee = this.state.matchingResponse;
    let searcheeMatch = {"userName": searchee.userName, "hashKey": searchee.hashKey};
    if (searchee.potentialMatches && searchee.potentialMatches.includes(searcherMatch)) {
      searchee.potentialMatches.splice(searchee.potentialMatches.indexOf(searcherMatch), 1);
    }
    let upDown = searchee.upDown ? searchee.upDown : { "up" : 0, "down" : 0};
    upDown.down = upDown.down + 1;
    searchee.upDown = upDown;
    this.setState({ matchingTarget: searcher});
    this.setState({ matchingResponse: searchee});
    this.handleShowRating(true);
  }
  handleSaveMatch = () => {
    let searcher = this.state.matchingTarget;
    let searchee = this.state.matchingResponse;
    searcher.seen = searcher.seen ? searcher.seen.concat(searchee.hashKey) : [searchee.hashKey];
    this.setState({ matchingTarget: searcher });
    this.handleSave(searcher);
    this.handleSave(searchee);
    this.handleShowRating(false);
    this.getMatch(searcher);
  }
  handleShowRating = (bool) => {
    this.setState({ rating: bool });
  }
  handleRating = (name, value) => {
    let searchee = this.state.matchingResponse;
    let rating = searchee[name] ? searchee[name] : { "avg" : 0, "count" : 0};
    rating.avg = ((rating.avg * rating.count) + value ) / (rating.count + 1);
    rating.count = rating.count + 1;
    searchee[name] = rating;
    this.setState({ matchingResponse: searchee });
  }
  handleSaveEdit = () => {
    let obj = this.state.editObj;
    if (!this.state.editTitle || !this.state.editBody ) {
      this.handleShowAlert(true, "Please fill all fields");
    } else if (this.state.editTitle.length === 0 || this.state.editBody.length === 0) {
      this.handleShowAlert(true, "Please fill all fields");
    } else if (this.state.editBody.length > 4800) {
      this.handleShowAlert(true, "Body must be under 4800 characters.");
    } else {
      obj.title = this.state.editTitle;
      obj.body = this.state.editBody;
      this.handleSave(obj);
      this.handleDiscardEdit();
    }
  }
  handleSave = (obj) => {
    this.loading(true);
    // API CALL
    let params = {body: obj};
    API.put(apiName, '/' + obj.itemType + '/' + this.state.username, params).then(response => {
      if (obj.hashKey !== response.hashKey) {
        this.setState(prevState => ({items: prevState.items.concat(response)}));
      }
      this.loading(false);
    }).catch(err => {
      this.handleShowAlert(true, err.message);
      this.loading(false);
    });
  }
  handleDiscardEdit = () => {
    this.setState({ editObj: null });
    this.setState({ editTitle: "" });
    this.setState({ editBody: "" });
    this.setState({ editing: false });
  }
  handleDelete = (obj) => {
    this.loading(true);
    API.del(apiName, '/' + this.state.itemType + '/' + obj.hashKey).then(response => {
      this.setState(prevState => ({
        items: prevState.items.filter(el => el.hashKey !== obj.hashKey)
      }));
      this.loading(false);
    }).catch(err => {
      this.handleShowAlert(true, err.message);
      this.loading(false);
    });
  }
  handleSwitchUser = (user) => {
    let newType = this.state.itemType;
    if (user === 1) {
      newType = 'Resume';
    } else if (user === 2) {
      newType = 'Job';
    }
    this.setState({ itemType: newType });
    this.updateItems(newType);
    this.handleCloseMenu();
  }
  handleSignOut = () => {
    Auth.signOut()
      .then(() => {this.props.onStateChange('signedOut', null)})
      .catch(err => {this.handleShowAlert(true, err.message)})
  }
  handleShowFeedback = (obj) => {
    this.setState({ feedback: obj });
  }
  handleShowAlert = (bool, msg) => {
    this.setState({ alert: bool });
    this.setState({ alertMsg: msg });
  }
  makeCard = (obj, i) => {
    const { classes } = this.props;
    return (
      <Paper key={i} className={classes.paper} elevation={0}>
        <Card className={classes.card}>
          <CardActionArea onClick={() => this.handleEdit(obj)}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {obj.title}
              </Typography>
              <Typography variant="body2">
                {obj.body.split("\n").map((i, key) => {
                      return <Typography key={key}>{i}</Typography>;
                })}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              variant="fab"
              color="secondary"
              aria-label="Edit"
              className={classes.button}
              onClick={() => this.handleEdit(obj)}
            >
              <EditIcon />
            </Button>
            <Button
              variant="extendedFab"
              color="primary"
              aria-label="Find Matches"
              className={classes.button}
              onClick={() => this.handleStartMatch(obj)}
            >
              <NavigationIcon className={classes.extendedIcon} />
              Find Matches
            </Button>
            <Button variant="extendedFab" aria-label="Feedback" className={classes.button} style={{backgroundColor: green[500], color: green[50]}} onClick={() => this.handleShowFeedback(obj)}>
              <ThumbsUpDownIcon className={classes.extendedIcon} />
              View Feedback
            </Button>
            <Button variant="fab" aria-label="Delete" className={classes.button} onClick={() => this.handleDelete(obj)}>
              <DeleteIcon />
            </Button>
          </CardActions>
        </Card>
        { obj.matches && <ExpansionPanel>
           <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
             <Typography>View Matches</Typography>
           </ExpansionPanelSummary>
           <ExpansionPanelDetails>
               {obj.matches.map((item, i) => (this.makeMatchButton(item, i)))}
           </ExpansionPanelDetails>
         </ExpansionPanel>}
      </Paper>
    );
  }

  makeMatchButton = (matchObj, i) => {
    const { classes } = this.props;
    return (
      <Button key={i} onClick={() => this.handleShowMatchDetails(matchObj)}>
        {this.state.matchObject && this.state.matchObject[matchObj.hashKey] ? this.state.matchObject[matchObj.hashKey].title : ""}
      </Button>
    )
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                onClick={this.state.drawer ? this.toggleDrawer(false) : this.toggleDrawer(true)}
              >
                {this.state.drawer ? <CloseIcon /> :  <MenuIcon />}
              </IconButton>
              <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleOpenMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleCloseMenu}
                 >
                 <MenuItem onClick={() => this.handleSwitchUser(1)}>Candidate</MenuItem>
                 <MenuItem onClick={() => this.handleSwitchUser(2)}>Employer</MenuItem>
                 <MenuItem onClick={this.handleSignOut}>Sign out</MenuItem>
               </Menu>
             </div>
           </Toolbar>
          </AppBar>
          <Drawer open={this.state.drawer} onClose={this.toggleDrawer(false)} className={classes.drawerPaper}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer(false)}
              onKeyDown={this.toggleDrawer(false)}
              className={classes.drawerPaper}
            >
                <List>
                  <div>
                    <ListItem button>
                      <ListItemIcon>
                        <ViewIcon />
                      </ListItemIcon>
                      <ListItemText primary={"My " + this.state.itemType + "s"} />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <ViewIcon />
                      </ListItemIcon>
                      <ListItemText primary="Edit Contact Details" onClick={() => this.handleShowContactDetails(true)}/>
                    </ListItem>
                  </div>
                </List>
            </div>
          </Drawer>
          <Grid className={classes.gridList} >
            <Typography variant="h5" className={classes.paper}>
              Your {this.state.itemType} Posts
            </Typography>
            {this.state.items.map((item, i) => (this.makeCard(item, i)))}
          </Grid>
          <div className={classes.addButtonContainer}>
            <Button variant="fab" color='secondary' onClick={this.handleNew()} className={classes.addButton}><AddIcon /></Button>
          </div>
          <Dialog open={this.state.editing}
            onClose={this.handleDiscardEdit}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={'md'}
            scroll={'body'}
            >
            <DialogTitle id="form-dialog-title">Edit {this.state.itemType}</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                fullWidth={true}
                value={this.state.editTitle}
                onChange={this.handleChange('editTitle')}
                className={classes.dialogField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Body"
                multiline={true}
                rowsMax="100"
                fullWidth={true}
                value={this.state.editBody}
                onChange={this.handleChange('editBody')}
                className={classes.dialogField}
                margin="normal"
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDiscardEdit} color="secondary">
                Discard
              </Button>
              <Button onClick={this.handleSaveEdit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.matching}
            aria-labelledby="match-dialog-title"
            fullWidth={true}
            maxWidth={'md'}
            scroll={'body'}
            onClose={() => this.handleShowMatch(false)}
            >
            <DialogTitle id="match-dialog-title">Find {this.state.matchingResponse ? this.state.matchingResponse.itemType : ""} </DialogTitle>
            <DialogContent>
              <Paper className={classes.paper} elevation={0}>
                <Typography variant="body2" >
                  {(this.state.matchingResponse ? this.state.matchingResponse.body : " ").split("\n").map((i, key) => {
                        return <Typography key={key}>{i}</Typography>;
                  })}
                </Typography>
                </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleBadMatch} color="secondary">
                <ThumbDownIcon />
              </Button>
              <Button onClick={this.handleGoodMatch} color="primary">
                <ThumbUpIcon />
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.rating}
            aria-labelledby="rating-dialog-title"
            maxWidth={'sm'}
            scroll={'body'}
            >
            <DialogTitle id="rating-dialog-title">Rating</DialogTitle>
            <DialogContent>
              <Rating value={0} name={this.state.matchingResponse ? ratingNames[this.state.matchingResponse.itemType][0] : null} onChange={this.handleRating.bind(this)} className={classes.rating} />
              <Rating value={0} name={this.state.matchingResponse ? ratingNames[this.state.matchingResponse.itemType][1] : null} onChange={this.handleRating.bind(this)} className={classes.rating}/>
              <Rating value={0} name={this.state.matchingResponse ? ratingNames[this.state.matchingResponse.itemType][2] : null} onChange={this.handleRating.bind(this)} className={classes.rating}/>
              <Rating value={0} name={this.state.matchingResponse ? ratingNames[this.state.matchingResponse.itemType][3] : null} onChange={this.handleRating.bind(this)} className={classes.rating}/>
              <Rating value={0} name={this.state.matchingResponse ? ratingNames[this.state.matchingResponse.itemType][4] : null} onChange={this.handleRating.bind(this)} className={classes.rating}/>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleSaveMatch} color="primary">
              Submit
            </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.feedback !== false}
            aria-labelledby="feedback-dialog-title"
            maxWidth={'sm'}
            scroll={'body'}
            onClose={() => this.handleShowFeedback(false)}
            >
            <DialogTitle id="match-dialog-title">Feedback</DialogTitle>
            <DialogContent>
              <Rating value={this.state.feedback[ratingNames[this.state.itemType][0]] ? this.state.feedback[ratingNames[this.state.itemType][0]].avg : 2} name={ratingNames[this.state.itemType][0]} disabled={true} className={classes.rating} />
              <Rating value={this.state.feedback[ratingNames[this.state.itemType][1]] ? this.state.feedback[ratingNames[this.state.itemType][1]].avg : 2} name={ratingNames[this.state.itemType][1]} disabled={true} className={classes.rating}/>
              <Rating value={this.state.feedback[ratingNames[this.state.itemType][2]] ? this.state.feedback[ratingNames[this.state.itemType][2]].avg : 2} name={ratingNames[this.state.itemType][2]} disabled={true} className={classes.rating}/>
              <Rating value={this.state.feedback[ratingNames[this.state.itemType][3]] ? this.state.feedback[ratingNames[this.state.itemType][3]].avg : 2} name={ratingNames[this.state.itemType][3]} disabled={true} className={classes.rating}/>
              <Rating value={this.state.feedback[ratingNames[this.state.itemType][4]] ? this.state.feedback[ratingNames[this.state.itemType][4]].avg : 2} name={ratingNames[this.state.itemType][4]} disabled={true} className={classes.rating}/>
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
                    {this.state.feedback.upDown ? this.state.feedback.upDown.down : 0}
                   </Typography>
                 </Grid>
                 <Grid item xs={1}>
                  <ThumbUpIcon />
                 </Grid>
                 <Grid item xs={2}>
                   <Typography variant="h6" color="inherit" >
                    {this.state.feedback.upDown ? this.state.feedback.upDown.up : 0}
                   </Typography>
                 </Grid>
               </Grid>
            </DialogContent>
            <DialogActions>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.editContact}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={'md'}
            scroll={'body'}
            >
            <DialogTitle id="form-dialog-title">Edit Contact Details</DialogTitle>
            <DialogContent>
              <TextField
                label="Contact Name"
                rowsMax="100"
                fullWidth={true}
                value={this.state.contactName}
                onChange={this.handleChange('contactName')}
                className={classes.dialogField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Contact Email"
                rowsMax="100"
                fullWidth={true}
                value={this.state.contactEmail}
                onChange={this.handleChange('contactEmail')}
                className={classes.dialogField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Contact Phone"
                rowsMax="100"
                fullWidth={true}
                value={this.state.contactPhone}
                onChange={this.handleChange('contactPhone')}
                className={classes.dialogField}
                margin="normal"
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleShowContactDetails(false)} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.curMatchViewing !== null}
            aria-labelledby="match-dialog-title"
            fullWidth={true}
            maxWidth={'md'}
            scroll={'body'}
            onClose={() => this.handleShowMatchDetails(null)}
            >
            <DialogContent>
              <Paper className={classes.paper} elevation={2}>
                <Typography gutterBottom variant="h5">
                  {this.state.curMatchViewing ? this.state.matchObject[this.state.curMatchViewing.hashKey].title : ""}
                </Typography>
                <Typography gutterBottom variant="body2">
                  {this.state.curMatchViewing ? this.state.matchObject[this.state.curMatchViewing.hashKey].body.split("\n").map((i, key) => {
                        return <Typography key={key}>{i}</Typography>;
                  }) : ""}
                </Typography>
              </Paper>
              <Paper className={classes.paper} elevation={2}>
                <Grid container spacing={24} alignItems="center">
                  <Grid item xs={6}><Typography variant="body2">Name</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">{this.state.curMatchViewing ? this.state.matchObject[this.state.curMatchViewing.userName].name : ""}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">Email</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">{this.state.curMatchViewing ? this.state.matchObject[this.state.curMatchViewing.userName].email : ""}</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">Phone</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2">{this.state.curMatchViewing ? this.state.matchObject[this.state.curMatchViewing.userName].phone : ""}</Typography></Grid>
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleShowMatchDetails(null)} color="primary">
                Done
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.alert}
            maxWidth={'xs'}
            onClose={() => this.handleShowAlert(false, null)}
            >
            <DialogContent style={{textAlign: 'center'}}>
              <Typography variant="h6" className={classes.paper}>
                {this.state.alertMsg}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleShowAlert(false, null)} color="primary">
                Okay
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.loading}
            maxWidth={'xs'}
            >
            <DialogContent style={{textAlign: 'center'}}>
            <CircularProgress color="primary" />
            </DialogContent>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  withAuthenticator(App, false, [
  <SignIn/>,
  <ConfirmSignIn/>,
  <VerifyContact/>,
  <SignUp/>,
  <ConfirmSignUp/>,
  <ForgotPassword/>
]))
