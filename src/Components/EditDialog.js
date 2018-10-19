// REACT
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import AlertDialog from './AlertDialog';


class EditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      title: null,
      body: null
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = () => {
    this.setState({ title: null });
    this.setState({ body: null });
    this.props.onClose();
  }

  handleSave = () => {
    let obj = this.props.value;
    if (this.state.title) obj.title = this.state.title;
    if (this.state.body) obj.body = this.state.body;
    if (obj.title.length === 0 || obj.body.length === 0) {
      this.setState({ alert: "Please fill all fields" });
    } else if (obj.body.length > 4800) {
      this.setState({ alert: "Body must be under 4800 characters" });
    } else {
      this.props.onChange(obj);
      this.handleClose();
    }
  }

  render() {
    return (
      <Dialog open={this.props.value !== null}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={'md'}
        scroll={'body'}
        >
        <DialogTitle id="form-dialog-title">Edit {this.props.value ? this.props.value.itemType : null}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth={true}
            value={this.state.title ? this.state.title : (this.props.value ? this.props.value.title : null)}
            onChange={this.handleChange('title')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Body"
            multiline={true}
            rowsMax="100"
            fullWidth={true}
            value={this.state.body ? this.state.body : (this.props.value ? this.props.value.body : null)}
            onChange={this.handleChange('body')}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Discard
          </Button>
          <Button onClick={this.handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
        <AlertDialog value={this.state.alert} onClose={() => this.setState({ alert: null })} />
      </Dialog>
    );
  }
}

export default EditDialog;
