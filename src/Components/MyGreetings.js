// REACT
import React, { Component } from 'react';

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

// AMPLIFY DEPENDICIES
import Amplify, { Auth } from 'aws-amplify';
import { Greetings } from 'aws-amplify-react';

const styles = {
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

// This is my custom Greetings in component
class MyGreetings extends Greetings {

  constructor(props) {
      super(props);
      this.state = {
        anchorEl: null
      };
      this.signOut = this.signOut.bind(this);
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleSignOut = () => {
  Auth.signOut()
    .then(() => this.changeState('signedOut'))
    .catch(err => alert(err.message));
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
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
               <MenuItem onClick={this.signOut}>Sign out</MenuItem>
             </Menu>
           </div>
       </Toolbar>
      </AppBar>      
    )
  }
}

// IMPORT MATERIAL UI CLASSES
MyGreetings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyGreetings);
