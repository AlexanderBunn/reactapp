// REACT
import React, { Component } from 'react';
import './App.css';

// MATERIAL UI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


// AMPLIFY AUTHENICATOR
import { Greetings, ConfirmSignIn, ConfirmSignUp, ForgotPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

// AWS AMPLIFY
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './exports.js';
Amplify.configure(aws_exports);

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class App extends Component {

  state = {
    auth: true,
    anchorEl: null,
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

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div className={classes.root}>
        <head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
        </head>
          <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
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
  withAuthenticator(App, true, [
  <Greetings/>,
  <SignIn/>,
  <ConfirmSignIn/>,
  <VerifyContact/>,
  <SignUp/>,
  <ConfirmSignUp/>,
  <ForgotPassword/>
]))
