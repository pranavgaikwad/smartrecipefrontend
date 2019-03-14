import { connect } from 'react-redux';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { sampleRecipe } from '../../utils/app.constants';
import EditRecipeFormComponent from '../forms/edit-recipe-form.component';

class AddRecipeDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: {
        name: sampleRecipe.name,
        short_description: sampleRecipe.shortDescription,
        description: sampleRecipe.description,
        ingredients: sampleRecipe.ingredients,
      },
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  
  onFormSubmit(e, recipe, nextFunction) {
    // callback from parent component
    nextFunction(e, recipe);
  }

  render() {
    const { 
      open, 
      recipe,
      onClose,
      onSubmit,
      onFormChange,
      onIngredientAdded,
      onIngredientDeleted,
    } = this.props;
  
    return (
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Recipe</DialogTitle>
        <DialogContent>
          <EditRecipeFormComponent 
            recipe={recipe} 
            onFormChange={onFormChange} 
            onIngredientAdded={onIngredientAdded} 
            onIngredientDeleted={onIngredientDeleted}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={(e) => this.onFormSubmit(e, recipe, onSubmit)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  allIngredients: state.ingredientsReducer.ingredients,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddRecipeDialog);