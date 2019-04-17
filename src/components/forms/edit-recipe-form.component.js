import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import IngredientListComponent from '../lists/ingredients-list.component';
import FlavorTagsChipsComponent from '../chips/flavor-tags-chips.component';


/**
 * Generic form component used as 'Edit recipe ' / 'Add new recipe'
 */
class EditRecipeFormComponent extends Component {
  render() {
    const {
      user,
      recipe, // recipe 
      classes,
      onSubmit, // submit function passed from parent component
      onFormChange, // callback for handling updates in the form
      onFlavorTagAdded, // when the user adds a new flavor tag to the recipe
      onIngredientAdded, // when user adds a new ingredient to the recipe
      onFlavorTagDeleted, // when user deletes a flavor tag from the recipe
      onIngredientDeleted, // when user deletes an ingredient
    } = this.props;

    let title = '', shortDescription = '', description = '', ingredients = [], flavorTags = []; 
    
    if (recipe !== null && recipe !== undefined && recipe) {
      title = recipe.name;
      shortDescription = recipe.desc; 
      description = recipe.instructions;
      ingredients = recipe.ingredients;
      flavorTags = recipe.flavorTags;
    }

    console.log("Got new recipe ", flavorTags);

    let allIngredients = [];

    const { fridge } = user;

    if (fridge) {
      const { ingredients } = fridge;
      allIngredients = ingredients;
    }

    const showFlavourTags = true ? flavorTags.length > 0 : false;

    const showIngredientsDropdown = true ? allIngredients.length > 0 : false;
    
    return (
      <div>
        <Typography component="h6" variant="h5">
          {title}
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="title">Title</InputLabel>
            <Input id="title" value={title} onChange={onFormChange} name="title" autoComplete="title" autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="Short Description">Short Description</InputLabel>
            <Input name="short_description" id="short_description" value={shortDescription} onChange={onFormChange} multiline rows='2' rowsMax='4' autoComplete="short_description" />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="Description">Description</InputLabel>
            <Input name="description" id="description" value={description} onChange={onFormChange} multiline rows='5' rowsMax='10' autoComplete="description" />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <IngredientListComponent ingredients={ingredients} handleDelete={onIngredientDeleted}/>
          </FormControl>
          {
            showIngredientsDropdown &&
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="ingredient">Add Ingredient</InputLabel>
              <Select
                native
                id='ingredient-dropdown'
                onClick={(e) => onIngredientAdded(e)}
                inputProps={{
                  name: 'Ingredient',
                  id: 'ingredient',
                }}
              >
                  {
                    allIngredients.map((data, id) => {
                      return (
                        <option key={id} value={id}>{data.name}</option>
                      );
                    })
                  }
              </Select>
            </FormControl>
          }
          {
            !showIngredientsDropdown &&
            <Typography component="p">
              Please add some ingredients...
            </Typography>
          }
          {
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="flavorTags">Add a flavor tag</InputLabel>
              <Input 
                id="flavorTags"
                name="flavorTags" 
                multiline 
                rows='1' 
                rowsMax='1' 
                autoComplete="flavorTags"
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      onFlavorTagAdded(ev.target.value)
                      ev.preventDefault();
                    }
                  }} 
              />
            </FormControl>
          }
          {
            showFlavourTags &&
            <FlavorTagsChipsComponent flavorTags={flavorTags} handleDelete={onFlavorTagDeleted}/>
          }
        </form>
      </div>
    );
  }
}

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  text: {
    alignItems: 'center',
  },
  button: {
    // margin: theme.spacing.unit,
  },
});

EditRecipeFormComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
});


const mapDispatchToProps = dispatch => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditRecipeFormComponent));
