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
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper'

// CARD ACTIONS
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';

// GRID LIST
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

// DIALOG
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// AMPLIFY AUTHENICATOR
import { Greetings, ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

// AWS AMPLIFY
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './exports.js';
Amplify.configure(aws_exports);

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
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
  addButton: {
    position: 'fixed',
    bottom: 40,
    paddingRight: '25%',
    paddingLeft: '25%',
    width: '50%',
    textAlign: 'center'
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    const testObj1 = {
      "title" : "Title 1",
      "body" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur tempor eros a rhoncus. Maecenas at luctus urna. Mauris in nibh leo. Donec vel tellus nec enim volutpat eleifend a vitae ex. Fusce tincidunt nisl risus, a tempus quam malesuada eu. In pretium, metus ut euismod tincidunt, dolor lectus aliquet diam, nec tincidunt tortor urna in ex. In hac habitasse platea dictumst. Mauris leo tortor, laoreet sed luctus laoreet, fermentum quis sapien. Nam scelerisque sapien ut arcu euismod, nec lacinia ipsum dapibus. In ultrices facilisis odio egestas efficitur. Aenean dignissim massa a blandit gravida. Pellentesque pulvinar enim id eros interdum euismod non et nunc. Morbi est leo, tincidunt vel metus eu, dapibus egestas enim. Morbi vel pulvinar dui. Vivamus et dui quam. Quisque mollis lorem orci, eget feugiat nisi dignissim at.",
    }
    const testObj2 = {
      "title" : "Title 2",
      "body" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur tempor eros a rhoncus."
    }
    const testItems = [testObj1, testObj2, testObj1, testObj2, testObj2, testObj1, testObj2, testObj2, testObj1];

    this.state = {
      itemType: "Job Post",
      anchorEl: null,
      drawer: false,
      editing: false,
      editObj: null,
      items: testItems,
    };
  }

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
    this.setState({ editing: true});
  }

  handleSave = (obj) => {
    this.setState({ editing: false});
  }

  handleDialogClose = () => {
    this.setState({ editing: false});
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
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {obj.title}
            </Typography>
            <Typography component="p" >
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
            value={obj.id}
            onClick={(e) => this.handleEdit(obj)}
          >
            <EditIcon />
          </Button>
          <Button variant="extendedFab" color="primary" aria-label="Delete" className={classes.button}>
            <NavigationIcon className={classes.extendedIcon} />
            Find Matches
          </Button>
          <Button variant="fab" aria-label="Delete" className={classes.button}>
            <DeleteIcon />
          </Button>
        </CardActions>
      </Card>
    );
  }

  render() {
    const { classes } = this.props;
    const { anchorEl, drawer } = this.state;
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
        <head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
        </head>
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
               <MenuItem onClick={this.handleCloseMenu}>Job-seeker</MenuItem>
               <MenuItem onClick={this.handleCloseMenu}>Employer</MenuItem>
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
        <Grid cellHeight={'auto'} className={classes.gridList}>
          <Typography variant="h5" component="h2" className={classes.paper}>
            Your {this.state.itemType}s
          </Typography>
          {this.state.items.map(item => (
            <Paper className={classes.paper} elevation={0}>
              {this.makeCard(item)}
            </Paper>
          ))}
        </Grid>
        <div className={classes.addButton}>
          <Button variant="fab" color='secondary' onClick={this.handleNew()}><AddIcon /></Button>
        </div>
        <Dialog
          open={this.state.editing}
          onClose={this.handleSave}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit {this.state.itemType}</DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="secondary">
              Discard
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
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
