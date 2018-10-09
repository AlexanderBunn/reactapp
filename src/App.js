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

// CARD ACTIONS
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';

// GRID LIST
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

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
    paddingTop: 60,
    paddingLeft: 250,
    paddingRight: 250,
    width: '100%',
    height: '100%',
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemType: "Job",
      anchorEl: null,
      drawer: false
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({drawer: open});
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleSignOut = () => {
    Auth.signOut()
      .then(() => {this.props.onStateChange('signedOut', null)})
      .catch(err => {alert('err: ', err.message)})
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
              <ListItemText primary="My Resumes" />
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

    const testObj = {
      "title" : "Resume 1",
      "body" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam efficitur tempor eros a rhoncus. Maecenas at luctus urna. Mauris in nibh leo. Donec vel tellus nec enim volutpat eleifend a vitae ex. Fusce tincidunt nisl risus, a tempus quam malesuada eu. In pretium, metus ut euismod tincidunt, dolor lectus aliquet diam, nec tincidunt tortor urna in ex. In hac habitasse platea dictumst. Mauris leo tortor, laoreet sed luctus laoreet, fermentum quis sapien. Nam scelerisque sapien ut arcu euismod, nec lacinia ipsum dapibus. In ultrices facilisis odio egestas efficitur. Aenean dignissim massa a blandit gravida. Pellentesque pulvinar enim id eros interdum euismod non et nunc. Morbi est leo, tincidunt vel metus eu, dapibus egestas enim. Morbi vel pulvinar dui. Vivamus et dui quam. Quisque mollis lorem orci, eget feugiat nisi dignissim at.",
    }

    const resumes = [testObj, testObj, testObj, testObj, testObj, testObj, testObj, testObj, testObj]

    function makeCard(obj) {
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
            <Button variant="fab" color="primary" aria-label="Add" className={classes.button}>
              <AddIcon />
            </Button>
            <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button}>
              <EditIcon />
            </Button>
            <Button variant="extendedFab" aria-label="Delete" className={classes.button}>
              <NavigationIcon className={classes.extendedIcon} />
              Find Matches
            </Button>
            <Button variant="fab" disabled aria-label="Delete" className={classes.button}>
              <DeleteIcon />
            </Button>
          </CardActions>
        </Card>
      );
    }

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
              onClick={this.toggleDrawer(true)}
            >
              <MenuIcon />
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
        <GridList cellHeight={'auto'} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Your Resumes</ListSubheader>
          </GridListTile>
          {resumes.map(res => (
            <GridListTile key={res.title}>
              {makeCard(res)}
            </GridListTile>
          ))}
        </GridList>
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
