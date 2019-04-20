import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import IngredientFilterListComponent from '../lists/ingredient-filter-list.component';
/**
 * Dialog component which contains the 'Edit Ingredient' form
 */
class IngredientFilterSelectionDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: null,
    };

    this.onRequestSubmit = this.onRequestSubmit.bind(this);
    this.onIngredientChecked = this.onIngredientChecked.bind(this);
  }

  onIngredientChecked(tag) {
    this.setState({ checked: tag });
  }

  componentDidMount() {
    this.setState({
      checked: null,
    });
  }

  onRequestSubmit(tag, nextFunction) {
    this.setState({ checked: null });

    nextFunction(tag);
  }

  render() {
    const { 
      open,
      onClose,
      onSubmit,
      ingredients,
    } = this.props;

    const { checked } = this.state; 
  
    return (
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Filter by Ingredient</DialogTitle>
        <DialogContent>
          <IngredientFilterListComponent ingredients={ingredients} checked={checked} onIngredientChecked={this.onIngredientChecked}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => this.onRequestSubmit(this.state.checked, onSubmit)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default IngredientFilterSelectionDialog;