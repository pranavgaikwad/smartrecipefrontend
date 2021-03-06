import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddIcon from '@material-ui/icons/Add';

import { getIngredients } from '../../actions/ingredients-page/ingredients-page.actions';
import { addRecipe, getRecipes, deleteRecipe } from '../../actions/recipes-page/recipes-page.actions';

import RecipeCardComponent from '../../components/cards/recipe-card.component';
import AddRecipeDialog from '../../components/dialogs/add-recipe-dialog.component';
import RecipeViewComponent from '../../components/dialogs/recipe-view-dialog.component';
import RecipeShareComponent from '../../components/dialogs/social-share-dialog.component';

const newRecipe = { name: '', desc: '', instructions: '', ingredients: [], nutVal: {} };

/**
 * Main Container for recipes page. 
 */
class RecipesPageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showShareDialog: false,
      showViewDialog: false,
      showEditDialog: false,
      recipe: newRecipe,
    };

    this.onCardActionClicked = this.onCardActionClicked.bind(this);
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.onCardViewClosed = this.onCardViewClosed.bind(this);
    this.onDialogFormChange = this.onDialogFormChange.bind(this);
    this.onAddButtonClicked = this.onAddButtonClicked.bind(this);
    this.onFormIngredientAdded = this.onFormIngredientAdded.bind(this);
    this.onFormIngredientDeleted = this.onFormIngredientDeleted.bind(this);
    this.onRecipeDeleteButtonClicked = this.onRecipeDeleteButtonClicked.bind(this);
  }

  /**
   * When 'add new recipe' button is clicked
   * @return
   */
  onAddButtonClicked() {
    this.setState({
      showViewDialog: true,
    });
  } 

  onCardViewClosed() {
    this.setState({
      recipe: newRecipe, 
      showViewDialog: false,
      showShareDialog: false,
      showEditDialog: false,
    });
  }

  /**
   * Handles subimitting recipe form
   * @param  {Object} e      Event
   * @param  {Object} recipe New recipe to add
   * @return
   */
  onDialogSubmit(e, recipe) {
    this.onCardViewClosed();

    this.props.addRecipe(recipe);
  }

  /**
   * Handles changes on new 'recipe' form
   * @param  {Object} e Event
   * @return
   */
  onDialogFormChange(e) {
    e.preventDefault();

    const { target } = e;

    switch (target.id) {
      case 'title':
        this.setState({
          recipe: {
            ...this.state.recipe,
            name: target.value,
          }
        });
        break;
      case 'short_description':
        this.setState({
          recipe: {
            ...this.state.recipe,
            short_description: target.value,
          }
        });
        break;
      case 'description':
        this.setState({
          recipe: {
            ...this.state.recipe,
            description: target.value,
          }
        });
        break;
      default:
        break;
    }
  }

  /**
   * Handles new ingredient added in a recipe form
   * @param  {Object} e event
   */
  onFormIngredientAdded(e) {
    const { 
      ingredients: currentIngredients,
    } = this.state.recipe;

    const {
      allIngredients
    } = this.props;

    const id = e.target.value;

    for (var i = 0; i < currentIngredients.length; i++) {
      if (currentIngredients[i].id == id) {   // eslint-disable-line
        return
      }
    }

    this.setState(state => {
      const ingredients = [...state.recipe.ingredients];

      let chipToAdd = {
        id: id,
      };

      for (var i = 0; i < allIngredients.length; i++) {
        if (allIngredients[i].id == id) {   // eslint-disable-line
          chipToAdd = allIngredients[i];
        }
      }

      ingredients.push(chipToAdd);
      return {
        recipe: {
          ...state.recipe,
          ingredients,
        } 
      };
    });
  }

  /**
   * Handles event when ingredient is deleted from a recipe
   * @param  {Object} data Ingredient data
   */
  onFormIngredientDeleted(data) {
    this.setState(state => {
      const ingredients = [...state.recipe.ingredients];
      const chipToDelete = ingredients.indexOf(data);
      ingredients.splice(chipToDelete, 1);
      return { 
        ...state,
        recipe: {
          ...state.recipe,
          ingredients, 
        }
      };
    });
  }

  onRecipeDeleteButtonClicked(id) {
    this.props.deleteRecipe(id);
  }

  onCardActionClicked(id, action) {
    const recipe = this.props.recipes.filter((recipe) => recipe.id === id);

    switch(action) {
      case 'EDIT':
        this.setState({
          showEditDialog: true,
          showViewDialog: false,
          showShareDialog: false,
          recipe: recipe[0],
        });
        break;
      case 'VIEW':
        this.setState({
          showViewDialog: true,
          showEditDialog: false,
          showShareDialog: false,
          recipe: recipe[0],
        });
        break;
      case 'SHARE':
        this.setState({
          showShareDialog: true,
          showViewDialog: false,
          showEditDialog: false,
          recipe: recipe[0],
        });
        break;
      default:
        break;
    }
  }

  /**
   * Generates a grid of specified size out of 
   * all recipe components available in the store.
   * @param  {Array} recipes List of recipes
   */
  getRecipesGrid(recipes) {
    const totalRecipes = recipes.length;

    let recipeItemComponents = []

    for (var i = 0; i < totalRecipes; i++) {
      const currentRecipe = recipes[i];

      if ((currentRecipe !== undefined) && (currentRecipe !== null)) {
        recipeItemComponents.push(
          <Grid 
            item 
            container
            justify="center"
            alignItems="center"
            key={"recipe_item_" + i} 
            xs={12} sm={6} md={4} lg={3} xl={3}>
            <RecipeCardComponent
              key={currentRecipe.id}
              recipe={currentRecipe}
              onCardActionClicked={this.onCardActionClicked}
              onDeleteButtonClicked={this.onRecipeDeleteButtonClicked}
            />
          </Grid>);
      }
    }

    return (
      <Grid key={"ing_row"} container spacing={8}>
        {recipeItemComponents}
      </Grid>
    );
  }

  componentDidMount() {
    this.props.getRecipes();
  }

  render() {
    const { showShareDialog, showViewDialog, recipe, showEditDialog } = this.state;

    const { 
      classes, 
      recipes,
      recipesRequestPending,
    } = this.props;

    let recipesGrid = []; 

    if (recipes !== undefined && recipes !== null) recipesGrid = this.getRecipesGrid(recipes);

    // const contentClass = recipesRequestPending ? classes.contentHidden : classes.content;

    return (
        <div className={classes.content}>
          <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.onAddButtonClicked}>
            <AddIcon />
          </Fab>
          {
            recipesRequestPending &&
            <CircularProgress className={classes.progress} thickness={4} size={72}/>
          }
          {
            <AddRecipeDialog
              recipe={recipe}
              open={showEditDialog} 
              onSubmit={this.onDialogSubmit} 
              onClose={this.onCardViewClosed} 
              onFormChange={this.onDialogFormChange}
              onIngredientAdded={this.onFormIngredientAdded}
              onIngredientDeleted={this.onFormIngredientDeleted}/>
          }
          {
            <RecipeViewComponent
              recipe={recipe}
              open={showViewDialog}
              onClose={this.onCardViewClosed}/>
          }
          {
            <RecipeShareComponent 
              recipe={recipe}
              open={showShareDialog}
              onClose={this.onCardViewClosed}/>
          }
          {
            recipesGrid
          }
        </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  content: {
    marginTop: '50px',
  },
  contentHidden: {
    opacity: 0.5,
    marginTop: '50px',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fab: {
    margin: 24,
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
  progress: {
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    position: 'absolute',
  },
});

RecipesPageContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes,
  currentRoute: state.navigationReducer.currentRoute,
  allIngredients: state.ingredientsReducer.ingredients,
  recipesRequestFailed: state.recipesReducer.isFailed,
  recipesRequestPending: state.recipesReducer.isPending,
});


const mapDispatchToProps = dispatch => ({
  getRecipes: () => dispatch(getRecipes()),
  getIngredients: () => dispatch(getIngredients()),
  deleteRecipe: (id) => dispatch(deleteRecipe(id)),
  addRecipe: (recipe) => dispatch(addRecipe(recipe)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecipesPageContainer));

