// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import AlertDialog from './AlertDialog'

class ContactDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      name: null,
      email: null,
      phone: null
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = () => {
    this.setState({ name: null });
    this.setState({ email: null });
    this.setState({ phone: null });
    this.props.onClose();
  }

  handleSave = () => {
    let obj = this.props.value;
    if (this.state.name !== null) obj.name = this.state.name;
    if (this.state.email !== null) obj.email = this.state.email;
    if (this.state.phone !== null) obj.phone = this.state.phone;
    if (!obj.name || !obj.email || !obj.phone) {
      this.setState({ alert: "Please fill all fields" });
    } else {
      this.props.onChange(obj);
      this.handleClose();
    }
  }

  render() {
    return (
      <Dialog open={this.props.value !== null}
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
            value={this.state.name === null ? (this.props.value ? this.props.value.name : "") : this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Contact Email"
            rowsMax="100"
            fullWidth={true}
            value={this.state.email === null ? (this.props.value ? this.props.value.email : "") : this.state.email}
            onChange={this.handleChange('email')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Contact Phone"
            rowsMax="100"
            fullWidth={true}
            value={this.state.phone === null ? (this.props.value ? this.props.value.phone : "") : this.state.phone}
            onChange={this.handleChange('phone')}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleSave()} color="primary">
            Save
          </Button>
        </DialogActions>
        <AlertDialog value={this.state.alert} onClose={() => this.setState({ alert: null })} />
      </Dialog>
    );
  }
}

export default ContactDialog;
