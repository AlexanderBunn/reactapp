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

// RATING DIALOG
import Rating from './Rating';


// LOADING DIALOG
import CircularProgress from '@material-ui/core/CircularProgress';

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
    width: 250,
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
});

const apiName = config.apiGateway.NAME;

// ADD CHECKS FOR ERRORS
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suspendLoad: false,
      username: Auth.user.username,
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
      matchingResponse: {},
      rating: false,
      items: [],
    };
    this.updateItems(this.state.itemType);
    // this.updateMatch();
  }
  loading = (bool) => {
    this.setState({ loading: bool });
  }
  updateItems = (newType) => {
    if (!this.state.suspendLoad) {
      this.loading(true);
      API.get(apiName, '/' + newType + '/' + this.state.username).then(response => {
        this.setState({items: response.Items});
        this.loading(false);
      }).catch(err => {
        alert(err.message);
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
      params.body.query.bool["must"] = { "terms" : {"_id": target.potentialMatches } };
    }
    if (target.seen) {
      params.body.query.bool["must_not"] = { "terms" : {"_id": target.seen } };
    }
    API.post(apiName, '/' + this.state.itemType + '/Search', params).then(response => {
      if (response['hits']) {
        let matchObj = response['hits']['hits'][0]['_source'];
        this.setState({ matchingResponse: matchObj });
        this.loading(false);
        this.handleShowMatch(true);
      } else {
        this.loading(false);
        this.handleShowMatch(false);
        alert("No matches");
        console.log(response);
      }
    }).catch(err => {
      this.loading(false);
      this.handleShowMatch(false);
      alert(err.message);
    });
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
    let newObj = {};
    newObj.itemType = this.state.itemType;
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
    let searchee = this.state.matchingResponse;
    let upDown = searchee.upDown ? searchee.upDown : { "up" : 0, "down" : 0};
    upDown.up = upDown.up + 1;
    searchee.upDown = upDown;
    // HAVE THEY MATCHED ME
    if (searcher.potentialMatches && searcher.potentialMatches.includes(searchee.hashKey)) {
      // THEY ARE NOW A FULL MATCH
      searcher.potentialMatches.splice(searcher.potentialMatches.indexOf(searchee.hashKey), 1);
      searcher.matches = searcher.matches ? searcher.matches.push(searchee.hashKey) : [searchee.hashKey];
      searchee.matches = searchee.matches ? searchee.matches.push(searcher.hashKey) : [searcher.hashKey];
    } else {
      // THEY ARE NOW A POTENTIAL MATCH
      searchee.potentialMatches = searchee.potentialMatches ? searchee.potentialMatches.push(searcher.hashKey) : [searcher.hashKey];
    }
    this.setState({ matchingResponse: searchee});
    this.handleShowRating(true);
  }
  handleBadMatch = () => {
    let searchee = this.state.matchingResponse;
    let upDown = searchee.upDown ? searchee.upDown : { "up" : 0, "down" : 0};
    upDown.down = upDown.down + 1;
    searchee.upDown = upDown;
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
    if (bool && this.state.matchingResponse.itemType === "Resume") {
      this.setState({ rating: true });
    } else if (bool) {
        this.handleSaveMatch();
    } else {
      this.setState({ rating: false });
    }
  }
  handleRating = (name, value) => {
    let searchee = this.state.matchingResponse;
    let rating = searchee[name] ? searchee[name] : { "ratio" : 0, "count" : 0};
    rating.ratio = ((rating.ratio * rating.count) + value ) / (rating.count + 1);
    rating.count = rating.count + 1;
    searchee[name] = rating;
    this.setState({ matchingResponse: searchee });
  }
  handleSaveEdit = () => {
    let obj = this.state.editObj;
    obj.title = this.state.editTitle;
    obj.body = this.state.editBody;
    this.handleSave(obj);
    this.handleDiscardEdit();
  }
  // ADD VALIDATE FORM
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
      alert(err.message);
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
      alert(err.message);
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
      .catch(err => {alert('err: ', err.message)})
  }
  makeCard = (obj) => {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea onClick={() => this.handleEdit(obj)}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              {obj.title}
            </Typography>
            <Typography variant="inherit" >
              {obj.body}
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
            aria-label="Delete"
            className={classes.button}
            onClick={() => this.handleStartMatch(obj)}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Find Matches
          </Button>
          <Button variant="fab" aria-label="Delete" className={classes.button} onClick={() => this.handleDelete(obj)}>
            <DeleteIcon />
          </Button>
        </CardActions>
      </Card>
    );
  }
  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const list = (
      <div>
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
              <ListItemText primary="View Matches" />
            </ListItem>
          </div>
        </List>
        <Divider />
      </div>
    );

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
              {list}
            </div>
          </Drawer>
          <Grid className={classes.gridList}>
            <Typography variant="h5" component="h2" className={classes.paper}>
              Your {this.state.itemType} Posts
            </Typography>
            {this.state.items.map((item, i) => (
              <Paper key={i} className={classes.paper} elevation={0}>
                {this.makeCard(item)}
              </Paper>
            ))}
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
            <DialogTitle id="match-dialog-title">Find Matches</DialogTitle>
            <DialogContent>
              <Paper className={classes.paper} elevation={0}>
                <Typography variant="inherit" >
                  {(this.state.matchingResponse) ? this.state.matchingResponse.body : ""}
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
            aria-labelledby="match-dialog-title"
            maxWidth={'sm'}
            scroll={'body'}
            >
            <DialogTitle id="match-dialog-title">Rating</DialogTitle>
            <DialogContent>
              <Rating label="Communication" name="communication" onChange={this.handleRating.bind(this)} className={classes.rating} />
              <Rating label="Hard Skills" name="hardSkills" onChange={this.handleRating.bind(this)} className={classes.rating}/>
              <Rating label="Soft Skills" name="softSkills" onChange={this.handleRating.bind(this)} className={classes.rating}/>
              <Rating label="Certifications" name="certifications" onChange={this.handleRating.bind(this)} className={classes.rating}/>
              <Rating label="Qualifications" name="qualifications" onChange={this.handleRating.bind(this)} className={classes.rating}/>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleSaveMatch} color="primary">
              Submit
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

// This is my custom Sign in component
// class MySignIn extends SignIn {
//   render() {
//     ...
//   }
// }

// IMPORT MATERIAL UI CLASSES
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
