import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddIcon from '@material-ui/icons/Add';

import { 
  addRecipe, 
  getRecipes, 
  editRecipe,
  deleteRecipe,
  searchRecipes,
  addToFavorite,
  getRecommendedRecipes,
} from '../../actions/recipes-page/recipes-page.actions';

import { 
  updateUser, 
} from '../../actions/auth/auth.actions';

import RecipeCardComponent from '../../components/cards/recipe-card.component';
import AddRecipeDialog from '../../components/dialogs/add-recipe-dialog.component';
import RecipeViewComponent from '../../components/dialogs/recipe-view-dialog.component';
import RecipeShareComponent from '../../components/dialogs/social-share-dialog.component';
import AddIngredientDialog from '../../components/dialogs/add-ingredient-dialog.component';

const newRecipe = { name: '', desc: '', instructions: '', ingredients: [], nutVal: {} };

const newIngredient = { name: "", quantity: "", unit: "" };

/**
 * Main Container for recipes page. 
 */
class RecipesPageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      recipe: newRecipe,
      showShareDialog: false,
      showViewDialog: false,
      showEditDialog: false,
      ingredientToAdd: newIngredient,
      showAddIngredientDialog: false,
    };

    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.onCardViewClosed = this.onCardViewClosed.bind(this);
    this.onDialogFormChange = this.onDialogFormChange.bind(this);
    this.onAddButtonClicked = this.onAddButtonClicked.bind(this);
    this.onCardActionClicked = this.onCardActionClicked.bind(this);
    this.onFormIngredientAdded = this.onFormIngredientAdded.bind(this);
    this.onFormIngredientDeleted = this.onFormIngredientDeleted.bind(this);
    this.onRecipeDeleteButtonClicked = this.onRecipeDeleteButtonClicked.bind(this);
    this.onAddIngredientDialogClosed = this.onAddIngredientDialogClosed.bind(this);
    this.onAddIngredientDialogSubmit = this.onAddIngredientDialogSubmit.bind(this);
  }

  /**
   * When 'add new recipe' button is clicked
   * @return
   */
  onAddButtonClicked() {
    this.setState({
      showEditDialog: true,
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

  onAddIngredientDialogClosed() {
    this.setState({
      ingredientToAdd: newIngredient,
      showAddIngredientDialog: false,
    });
  }

  onAddIngredientDialogSubmit() {
      const { ingredientToAdd } = this.state;

      this.onAddIngredientDialogClosed();

      if (ingredientToAdd) {
        this.setState(state => {
          const ingredients = [...state.recipe.ingredients];
          const chipToAdd = ingredientToAdd;
          ingredients.push(chipToAdd);
          return {
            recipe: {
              ...state.recipe,
              ingredients,
            } 
          };
        });
      }
  }

  /**
   * Handles subimitting recipe form
   * @param  {Object} e      Event
   * @param  {Object} recipe New recipe to add
   * @return
   */
  onDialogSubmit(e, recipe) {
    const { editMode } = this.state;

    this.onCardViewClosed();

    if (editMode) {
      this.props.editRecipe(recipe);
    } else { 
      this.props.addRecipe(recipe);
    }
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
            desc: target.value,
          }
        });
        break;
      case 'description':
        this.setState({
          recipe: {
            ...this.state.recipe,
            instructions: target.value,
          }
        });
        break;
      case 'quantity':
        this.setState({
          ingredientToAdd: {
            ...this.state.ingredientToAdd,
            quantity: target.value,
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
      user
    } = this.props;
    
    const id = e.target.value;

    const { fridge } = user;

    let allIngredients = [];

    if (fridge) {
      const { ingredients } = fridge; 
      allIngredients = ingredients;
    }

    for (var i = 0; i < currentIngredients.length; i++) {
      if (currentIngredients[i].name == allIngredients[id].name) {   // eslint-disable-line
        return
      }
    }

    if (allIngredients[id]) {
      this.setState({ showAddIngredientDialog: true, ingredientToAdd: allIngredients[id] });
    }
  }

  /**
   * Handles event when ingredient is deleted from a recipe
   * @param  {Object} data Ingredient data
   */
  onFormIngredientDeleted(id) {
    this.setState(state => {
      const ingredients = [...state.recipe.ingredients];
      ingredients.splice(id, 1);
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

  addToFavorite(recipe, isDisabled, isFavorite) {
    let { user } = this.props;
    let { cookbook } = user;
    let { favorites } = cookbook;

    if (!isFavorite){
      favorites.push(recipe);
    }
    else {
      const index = favorites.findIndex(x=> x.name === recipe.name);
      if (index != -1) {
        favorites.splice(index, 1);
      }
    }

    user = {
      ...user,
      cookbook: {
        ...cookbook,
        favorites,
      }
    };

    this.props.updateUser(user);
  }

  onCardActionClicked(recipeName, action, isDisabled, isFavorite) {
    const index = this.props.recipes.findIndex(x => x.name === recipeName);

    if (index == -1) return;

    let recipe = this.props.recipes[index];

    recipe = {
      ...recipe, 
      disabled: isDisabled,
      isFavorite: isFavorite,
    }

    switch(action) {
      case 'EDIT':
        this.setState({
          showEditDialog: true,
          showViewDialog: false,
          showShareDialog: false,
          editMode: true,
          recipe,
        });
        break;
      case 'VIEW':
        this.setState({
          showViewDialog: true,
          showEditDialog: false,
          showShareDialog: false,
          editMode: false,
          recipe,
        });
        break;
      case 'SHARE':
        this.setState({
          showShareDialog: true,
          showViewDialog: false,
          showEditDialog: false,
          editMode: false,
          recipe,
        });
        break;
      case 'FAVORITE':
        this.addToFavorite(recipe, isDisabled, isFavorite);
        break;
      default:
        break;
    }
  }

  processResults(recipes) {
    let i = 0, index = -1;
    // process recommended recipe
    const { recommendedRecipe } = this.props;
    // process search results
    const { searchResults } = this.props;
    // process favorites
    const { user } = this.props;
    const { cookbook } = user;
    const { favorites } = cookbook;

    let updatedRecipes = Object.assign([], recipes);

    let updatedRecommendedRecipe = Object.assign({}, recommendedRecipe)

    if (recommendedRecipe) {
      index = favorites.findIndex(x=> x.name === recommendedRecipe.name)
      if (index != -1) {
        updatedRecommendedRecipe = {
          ...updatedRecommendedRecipe,
          disabled: false,
          isFavorite: true,
          recommended: true,
        }
      } else {
        updatedRecommendedRecipe = {
          ...updatedRecommendedRecipe,
          disabled: false,
          recommended: true,
        }     
      }
    }

    if (recommendedRecipe) {
      index = searchResults.findIndex(x=> x.name === recommendedRecipe.name);
      if (index != -1) {
        searchResults.splice(index, 1);
      }

      index = updatedRecipes.findIndex(x=> x.name === recommendedRecipe.name);
      if (index != -1) {
        updatedRecipes.splice(index, 1);
      }
    }

    let updatedSearchResults = Object.assign([], searchResults);
    let firstHalf = [];
    let secondHalf = [];
    for (i=0; i < updatedSearchResults.length; i++) {
      let searchResult = updatedSearchResults[i];
      index = favorites.findIndex(x=> x.name === searchResult.name);
      if (index != -1) {
        searchResult = {
          ...searchResult,
          disabled: false,
          isFavorite: true,
        }
        firstHalf.push(searchResult);
      } else {
        searchResult = {
          ...searchResult,
          disabled: false,
        }
        secondHalf.push(searchResult);
      }
    }

    if (updatedRecommendedRecipe.length > 0) {
      updatedSearchResults = [
        updatedRecommendedRecipe,
        ...firstHalf,
        ...secondHalf,
      ];
    } else {
      updatedSearchResults = [
        ...firstHalf,
        ...secondHalf,
      ];
    }

    for (i=0; i < updatedSearchResults.length; i++) {
      const result = updatedSearchResults[i];
      index  = updatedRecipes.findIndex(x=> x.name === result.name);
      if (index != -1) {
        updatedRecipes.splice(index, 1);
      }
    }

    let remainingRecipes = Object.assign([], updatedRecipes);
    let favoriteRemaining = [];
    for (i=0; i < remainingRecipes.length; i++) { 
      let remainingRecipe = remainingRecipes[i];
      index = favorites.findIndex(x=> x.name === remainingRecipe.name);
      if (index != -1) {
        updatedRecipes.splice(index, 1);
        remainingRecipe = {
          ...remainingRecipe,
          isFavorite: true,
        }
        favoriteRemaining.push(remainingRecipe);
      }
    }

    favoriteRemaining = [
      ...favoriteRemaining,
      ...updatedRecipes,
    ];

    return [
      ...updatedSearchResults,
      ...favoriteRemaining,
    ];
  }

  registerSearchResults(recipes) {
    const { searchResults } = this.props;

    let updatedRecipes = Object.assign([], recipes);

    for (var i=0; i < searchResults.length; i++) {
      let searchResult = searchResults[i];
      searchResult = {
        ...searchResult,
        disabled: false
      }
      let index = updatedRecipes.findIndex(x=> x.name === searchResult.name);
      if (index != -1) {
        updatedRecipes.splice(index, 1);
        updatedRecipes = [
          searchResult,
          ...updatedRecipes,
        ];
      }
    }

    return updatedRecipes;
  }

  registerFavorites(recipes) {
    const { user } = this.props;
    const { cookbook } = user;
    const { favorites } = cookbook;
    let updatedRecipes = Object.assign([], recipes);

    let i = 0;
    for (i=0; i < favorites.length; i++) {
      let favoriteRecipe = favorites[i];
      favoriteRecipe = {
        ...favoriteRecipe,
        isFavorite: true,
      };
      let index = updatedRecipes.findIndex(x=> x.name === favoriteRecipe.name);
      if (index != -1) {
        updatedRecipes.splice(index, 1);
        updatedRecipes = [
          favoriteRecipe,
          ...updatedRecipes,
        ];   
      }
    }
    return updatedRecipes;
  }

  registerRecommendedRecipe(recipes) {
    let { recommendedRecipe } = this.props;

    let index = -1; 
    
    if (recommendedRecipe) index = recipes.findIndex(x=> x.name === recommendedRecipe.name);

    if (index != -1) recommendedRecipe = recipes[index];

    recommendedRecipe = {
      ...recommendedRecipe,
      recommended: true,
      disabled: false,
    };

    let updatedRecipes = Object.assign([], recipes); 

    index = updatedRecipes.findIndex(x=> x.name === recommendedRecipe.name);
    if (index != -1) {
      updatedRecipes.splice(index, 1);
      updatedRecipes = [
        recommendedRecipe, 
        ...updatedRecipes,
      ];
    }
    return updatedRecipes;
  }

  /**
   * Generates a grid of specified size out of 
   * all recipe components available in the store.
   * @param  {Array} recipes List of recipes
   */
  getRecipesGrid(recipes) {
    recipes = this.processResults(recipes);

    console.log("Displaying recipes ", recipes);

    let recipeItemComponents = [];

    for (var i = 0; i < recipes.length; i++) {
      const currentRecipe = recipes[i];

      let disabled = true;
      let isFavorite = false;
      let isRecommended = false;

      if (currentRecipe.recommended) isRecommended = true;

      if (currentRecipe.isFavorite) isFavorite = true;

      if (currentRecipe.disabled == false) disabled = currentRecipe.disabled;

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
              id={i}
              key={i}
              disabled={disabled}
              recipe={currentRecipe}
              isFavorite={isFavorite}
              recommended={isRecommended}
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
    const { user, recommendedRecipe } = this.props;

    this.props.getRecipes();
    
    if (user) this.props.searchRecipes(user, [""]);
    
    if (user && recommendedRecipe === null) {
      this.props.getRecommendedRecipes(user);
    }
  }

  render() {
    const { 
      recipe, 
      showEditDialog, 
      showViewDialog, 
      showShareDialog,
      ingredientToAdd,
      showAddIngredientDialog,
    } = this.state;

    const { 
      classes, 
      recipes,
      recipesRequestPending,
    } = this.props;

    let recipesGrid = []; 

    if (recipes !== undefined && recipes !== null && recipes.length > 0) recipesGrid = this.getRecipesGrid(recipes);

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
            <AddIngredientDialog
              viewOnly={true}
              ingredient={ingredientToAdd}
              open={showAddIngredientDialog} 
              onFormChange={this.onDialogFormChange}
              onClose={this.onAddIngredientDialogClosed}
              onSubmit={this.onAddIngredientDialogSubmit} 
              />
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
  user: state.authReducer.user,
  recipes: state.recipesReducer.recipes,
  searchResults: state.recipesReducer.searchResults,
  currentRoute: state.navigationReducer.currentRoute,
  recipesRequestFailed: state.recipesReducer.isFailed,
  recipesRequestPending: state.recipesReducer.isPending,
  recommendedRecipe: state.recipesReducer.recommendedRecipe,
});


const mapDispatchToProps = dispatch => ({
  getRecipes: () => dispatch(getRecipes()),
  updateUser: (user) => dispatch(updateUser(user)),
  deleteRecipe: (id) => dispatch(deleteRecipe(id)),
  addRecipe: (recipe) => dispatch(addRecipe(recipe)),
  editRecipe: (recipe) => dispatch(editRecipe(recipe)),
  addToFavorite: (user) => dispatch(addToFavorite(user)),
  getRecommendedRecipes: (user) => dispatch(getRecommendedRecipes(user)),
  searchRecipes: (user, filters) => dispatch(searchRecipes(user, filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecipesPageContainer));

