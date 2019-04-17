import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import FlavorTagListComponent from '../lists/flavor-tags-list.component';
/**
 * Dialog component which contains the 'Edit Ingredient' form
 */
class FlavorTagSelectionDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: [],
    };

    this.onFlavorTagChecked = this.onFlavorTagChecked.bind(this);
  }

  onFlavorTagChecked(tag) {
    const index = this.state.checked.findIndex(x => x === tag);
    if (index == -1) {
      this.setState({
        checked: [
          ...this.state.checked,
          tag
        ]
      });
    } else {
      let newCheckedList = Object.assign([], this.state.checked);
      newCheckedList.splice(index, 1);
      this.setState({
        checked: newCheckedList,
      });
    }
  }

  componentDidMount() {
    this.setState({
      checked: [],
    });
  }

  render() {
    const { 
      open,
      onClose,
      onSubmit,
      flavorTags,
    } = this.props;

    const { checked } = this.state; 
  
    return (
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select Flavor Tags</DialogTitle>
        <DialogContent>
          <FlavorTagListComponent flavorTags={flavorTags} checked={checked} onFlavorTagChecked={this.onFlavorTagChecked}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => onSubmit(this.state.checked)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FlavorTagSelectionDialog;