// REACT
import React, { Component } from 'react';
import './App.css';

// MATERIAL UI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

// AMPLIFY AUTHENICATOR
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

// AWS AMPLIFY
import Amplify, { Auth, API } from 'aws-amplify';
import aws_exports from './exports';
import config from './config'
Amplify.configure(aws_exports);

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
});

const apiName = config.apiGateway.NAME;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: Auth.user.username,
      itemType: 'Resume',
      anchorEl: null,
      drawer: false,
      editing: false,
      editObj: null,
      editTitle: "",
      editBody: "",
      matching: false,
      matchObj: null,
      matchTitle: "Match Title",
      matchBody: "This is the match body.",
      rating: true,
      items: [],
    };
    this.updateItems(this.state.itemType);
  }
  updateItems = (newType) => {
    API.get(apiName, '/' + newType + '/' + this.state.username).then(response => {
      this.setState({items: response.Items})
    }).catch(err => {alert(err.message)});
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
    this.handleEdit(newObj);
  }
  handleEdit = (obj) => {
    this.setState({ editObj: obj });
    this.setState({ editTitle: obj.title });
    this.setState({ editBody: obj.body });
    this.setState({ editing: true });
  }
  // ADD VALIDATE FORM
  handleSave = () => {
    let obj = this.state.editObj;
    obj.title = this.state.editTitle;
    obj.body = this.state.editBody;
    // API CALL
    let params = {body: obj};
    API.put(apiName, '/' + this.state.itemType + '/' + this.state.username, params).then(response => {
      this.handleDelete(obj);
      this.setState(prevState => ({items: prevState.items.concat(response)}));
    }).catch(err => {alert(err.message)});
    this.handleDiscard();
  }
  handleDiscard = () => {
    this.setState({ editObj: null });
    this.setState({ editTitle: "" });
    this.setState({ editBody: "" });
    this.setState({ editing: false});
  }
  handleDelete = (obj) => {
    API.del(apiName, '/' + this.state.itemType + '/' + obj.hashKey).then(response => {
      this.setState(prevState => ({
        items: prevState.items.filter(el => el.hashKey !== obj.hashKey)
      }));
    }).catch(err => {alert(err.message)});
  }
  handleSwitchUser = (user) => {
    let newType = this.state.itemType;
    if (user === 1) {
      newType = 'Resume';
    } else if (user === 2) {
      newType = 'Job';
    }
    this.setState({ itemType: newType })
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
          <Button variant="extendedFab" color="primary" aria-label="Delete" className={classes.button}>
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
               <MenuItem onClick={() => this.handleSwitchUser(1)}>Job-seeker</MenuItem>
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
            Your {this.state.itemType}s
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
        <Dialog
          open={this.state.editing}
          onClose={this.handleDiscard}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth={'md'}
          scroll={'body'}
          >
          <DialogTitle id="form-dialog-title">Edit {this.state.itemType}</DialogTitle>
          <DialogContent>
            <TextField
              id="editTitle"
              label="Title"
              fullWidth={true}
              value={this.state.editTitle}
              onChange={this.handleChange('editTitle')}
              className={classes.dialogField}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="editBody"
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
            <Button onClick={this.handleDiscard} color="secondary">
              Discard
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.matching}
          aria-labelledby="match-dialog-title"
          fullWidth={true}
          maxWidth={'md'}
          >
          <DialogTitle id="match-dialog-title">Find Matches</DialogTitle>
          <DialogContent>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="inherit" >
                {this.state.matchBody}
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
        <Dialog
          open={this.state.rating}
          aria-labelledby="match-dialog-title"
          fullWidth={true}
          maxWidth={'md'}
          >
          <DialogTitle id="match-dialog-title">Rating</DialogTitle>
          <DialogContent style={{textAlign: 'center'}}>
            <Typography variant="inherit"> Rating: </Typography>
            <Button onClick={this.handleBadMatch} >
              <Star />
            </Button>
            <Button onClick={this.handleBadMatch} >
              <Star />
            </Button>
            <Button onClick={this.handleBadMatch} >
              <Star />
            </Button>
            <Button onClick={this.handleBadMatch} >
              <Star />
            </Button>
            <Button onClick={this.handleBadMatch} >
              <Star />
            </Button>
          </DialogContent>
          <DialogActions>

          </DialogActions>
        </Dialog>
      </div>
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
