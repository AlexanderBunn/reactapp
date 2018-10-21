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

// DRAWER LIST
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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

import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';

// CUSTOM DIALOGS
import LoadingDialog from './Components/LoadingDialog';
import AlertDialog from './Components/AlertDialog';
import EditDialog from './Components/EditDialog';
import ContactDialog from './Components/ContactDialog';
import FindMatchDialog from './Components/FindMatchDialog';
import ViewMatchDialog from './Components/ViewMatchDialog';
import FeedbackDialog from './Components/FeedbackDialog';

// MATCH EXPANSION PANEL
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// AMPLIFY AUTHENICATOR
import { SignIn, ConfirmSignUp, ForgotPassword, SignUp, withAuthenticator } from 'aws-amplify-react';
import MySignIn from './Components/Authentication/MySignIn';
import MySignUp from './Components/Authentication/MySignUp';
import MyConfirmSignUp from './Components/Authentication/MyConfirmSignUp';
import MyForgotPassword from './Components/Authentication/MyForgotPassword';

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

const ratingLabels = {
  "Job" : ["Benefit", "Intrest", "Usefulness", "Rewarding", "Achievable"],
  "Resume" : ["Communication Skills", "Soft Skills", "Hard Skills", "Experience", "Qualifications"]
};

const apiName = config.apiGateway.NAME;

// ADD CHECKS FOR ERRORS
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suspendLoad: false,
      username: Auth.user.username,
      contact: null,
      editContact: null,
      itemType: 'Resume',
      loading: false,
      anchorEl: null,
      drawer: false,
      editItem: null,
      matchingTarget: null,
      matchingResponse: null,
      feedback: null,
      viewMatch: null,
      matchStore: {},
      alert: null,
      items: [],
    };
    this.updateItems(this.state.itemType);
    this.checkContactDetails();
  }

  loading = (bool) => {
    this.setState({ loading: bool });
  }
  updateItems = (itemType) => {
    if (!this.state.suspendLoad) {
      this.loading(true);
      API.get(apiName, '/' + itemType + '/' + this.state.username).then(response => {
        this.setState({items: response.Items});
        response.Items.forEach(obj =>
          obj.matches ? (obj.matches.forEach(item => this.storeMatch(item))) : ""
        );
        this.loading(false);
      }).catch(err => {
        this.setState({ alert: err.message });
        this.loading(false);
      });
    }
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
    this.setState({ editItem: newObj  });
  }

  handleDelete = (obj) => {
    this.loading(true);
    API.del(apiName, '/' + this.state.itemType + '/' + obj.hashKey).then(response => {
      this.setState(prevState => ({
        items: prevState.items.filter(el => el.hashKey !== obj.hashKey)
      }));
      this.loading(false);
    }).catch(err => {
      this.setState({ alert: err.message });
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
      .catch(err => {this.setState({ alert: err.message })})
  }

  saveItem = (obj) => {
    this.loading(true);
    // API CALL
    let params = {body: obj};
    API.put(apiName, '/' + obj.itemType + '/' + this.state.username, params).then(response => {
      if (obj.userName === this.state.username) {
        if (obj.hashKey !== response.hashKey) {
          // was new item : add item
          this.setState(prevState => ({items: prevState.items.concat(response)}));
        } else {
          let oldItem = this.state.items.filter(el => el.hashKey === obj.hashKey);
          let index = this.state.items.indexOf(oldItem);
          let newItems = this.state.items;
          newItems[index] = obj;
          this.setState({ items: newItems });
        }

      }
      this.loading(false);
    }).catch(err => {
      this.handleShowAlert(true, err.message);
      this.loading(false);
    });
  }
  checkContactDetails = () => {
    API.get(apiName, '/Contact/' + this.state.username).then(response => {
      if (response.Item === undefined) {
        this.setState({ editContact: {} });
        this.setState({ alert: "Please update contact details" });
      } else {
        this.setState({ contact: response.Item });
      }
    }).catch(err => {
      this.setState({ alert: err.message });
    });
  }
  saveContact = (obj) => {
    this.loading(true);
    let params = {body: obj};
    API.put(apiName, '/Contact/' + this.state.username, params).then(response => {
      this.loading(false);
      this.setState({ contact: response });
    }).catch(err => {
      this.setState({ alert: err.message });
      this.loading(false);
    });
  }

  getMatch = (target) => {
    if (target === null) {
      this.setState({ matchingTarget: null });
      this.setState({ matchingResponse: null });
    } else {
      this.loading(true);
      this.setState({ matchingTarget: target });
      // let target = (obj === null) ? this.state.matchingTarget : obj;
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
        search.push(newSearch);
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
      API.post(apiName, '/' + target.itemType + '/Search', params).then(response => {
        if (response['error'] || response['hits']['hits'].length === 0) {
          this.loading(false);
          this.setState({ matchingResponse: null });
          this.setState({ alert: "No matches" });
          console.log(response);
        } else {
          this.setState({ matchingResponse: response['hits']['hits'][0]['_source'] });
          this.loading(false);
        }
      }).catch(err => {
        this.loading(false);
        this.setState({ matchingResponse: null });
        this.setState({ alert: err.message });
      });
    }
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
              {obj.body.split("\n").map((i, key) => {
                return <Typography variant="body2" key={key}>{i}</Typography>;
              })}
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              variant="fab"
              color="secondary"
              aria-label="Edit"
              className={classes.button}
              onClick={() => this.setState({ editItem: obj })}
            >
              <EditIcon />
            </Button>
            <Button
              variant="extendedFab"
              color="primary"
              aria-label="Find Matches"
              className={classes.button}
              onClick={() => this.getMatch(obj)}
            >
              <NavigationIcon className={classes.extendedIcon} />
              Find Matches
            </Button>
            <Button
              variant="extendedFab"
              className={classes.button}
              style={{backgroundColor: green[500], color: green[50]}}
              onClick={() => this.setState({feedback: obj })}
              >
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
         </ExpansionPanel> }
      </Paper>
    );
  }

  storeMatch = (matchObj) => {
    this.loading(true);
    API.get(apiName, '/' + this.state.itemType + '/Search/' + matchObj.hashKey).then(response1 => {
      let newMatchStore = this.state.matchStore ? this.state.matchStore : {};
      newMatchStore[matchObj.hashKey] = response1.Item;
      API.get(apiName, '/Contact/' + matchObj.userName).then(response2 => {
        newMatchStore[matchObj.userName] = response2.Item;
        this.setState({ matchStore: newMatchStore });
        this.loading(false);
      }).catch(err => {
        this.setState({ alert: err.message });
        this.loading(false);
      });
    }).catch(err => {
      this.setState({ alert: err.message });
      this.loading(false);
    });
  }

  makeMatchButton = (matchObj, i) => {
    return (
      <Button key={i} onClick={() => this.setState({ viewMatch: matchObj })}>
        {this.state.matchStore[matchObj.hashKey] ? this.state.matchStore[matchObj.hashKey].title : ""}
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
                      <ListItemText primary="Edit Contact Details" onClick={() => this.setState({ editContact: this.state.contact })}/>
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
          <AlertDialog
            value={this.state.alert}
            onClose={() => this.setState({ alert: null })}
            />
          <LoadingDialog
            open={this.state.loading}
            />
          <EditDialog
            value={this.state.editItem}
            onChange={(obj) => this.saveItem(obj)}
            onClose={() => this.setState({ editItem: null })}
            />
          <ContactDialog
            value={this.state.editContact}
            onChange={(obj) => this.saveContact(obj)}
            onClose={() => this.setState({ editContact: null })}
            />
          <FeedbackDialog
            value={this.state.feedback}
            labels={ratingLabels}
            onChange={(obj) => this.saveContact(obj)}
            onClose={() => this.setState({ feedback: null })}
            />
          <FindMatchDialog
            target={this.state.matchingTarget}
            response={this.state.matchingResponse}
            labels={ratingLabels}
            onSave={(obj) => this.saveItem(obj)}
            onMatch={(obj) => this.storeMatch(obj)}
            onReset={(obj) => this.getMatch(obj)}
            />
          <ViewMatchDialog
            value={this.state.viewMatch}
            matchStore={this.state.matchStore}
            onSave={(obj) => this.saveItem(obj)}
            onClose={() => this.setState({ viewMatch: null })}
            />
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
  <MySignIn/>,
  <MySignUp/>,
  <MyConfirmSignUp/>,
  <MyForgotPassword/>
]))
