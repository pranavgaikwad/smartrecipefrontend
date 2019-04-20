/* eslint-disable */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { createNotification } from 'react-redux-notify';
import CircularProgress from '@material-ui/core/CircularProgress';

import AddIcon from '@material-ui/icons/Add';
import StyleIcon from '@material-ui/icons/Style';
import FilterListIcon from '@material-ui/icons/FilterList';

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

import { errorNotification } from '../../utils/notify.config'; 

import RecipeCardComponent from '../../components/cards/recipe-card.component';
import AddRecipeDialog from '../../components/dialogs/add-recipe-dialog.component';
import RecipeViewComponent from '../../components/dialogs/recipe-view-dialog.component';
import RecipeShareComponent from '../../components/dialogs/social-share-dialog.component';
import AddIngredientDialog from '../../components/dialogs/add-ingredient-dialog.component';
import FlavorTagSelectionDialog from '../../components/dialogs/flavor-tag-selection-dialog.component';
import IngredientFilterSelectionDialog from '../../components/dialogs/ingredient-filter-selection-dialog.component';

const newRecipe = { name: '', desc: '', instructions: '', needsOneMoreIngredient: false, ingredients: [], nutVal: {}, flavorTags: [] };

const newIngredient = { name: "", quantity: "", unit: "" };

const actions = [
  { icon: <FilterListIcon style={{ color: '#f48fb1' }}/>, name: 'Flavor Filter' },
];

/**
 * Main Container for recipes page. 
 */
class RecipesPageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      recipe: newRecipe,
      allFlavorTags: [],
      showViewDialog: false,
      showEditDialog: false,
      showShareDialog: false,
      showFlavorFilterDialog: false,
      showIngredientFilterDialog: false,
      ingredientToAdd: newIngredient,
      showAddIngredientDialog: false,
      filterMenuState: {
        open: false,
        hidden: false,
      },
    };

    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.onCardViewClosed = this.onCardViewClosed.bind(this);
    this.onDialogFormChange = this.onDialogFormChange.bind(this);
    this.onAddButtonClicked = this.onAddButtonClicked.bind(this);
    this.onCardActionClicked = this.onCardActionClicked.bind(this);
    this.onFormFlavorTagAdded = this.onFormFlavorTagAdded.bind(this);
    this.onFormIngredientAdded = this.onFormIngredientAdded.bind(this);
    this.onFilterButtonClicked = this.onFilterButtonClicked.bind(this);
    this.onFormFlavorTagDeleted = this.onFormFlavorTagDeleted.bind(this);
    this.onFormIngredientDeleted = this.onFormIngredientDeleted.bind(this);
    this.onFlavorTagRequestSubmit = this.onFlavorTagRequestSubmit.bind(this);
    this.onRecipeDeleteButtonClicked = this.onRecipeDeleteButtonClicked.bind(this);
    this.onAddIngredientDialogClosed = this.onAddIngredientDialogClosed.bind(this);
    this.onAddIngredientDialogSubmit = this.onAddIngredientDialogSubmit.bind(this);
    this.onIngredientFilterButtonClicked = this.onIngredientFilterButtonClicked.bind(this);
    this.onIngredientFilterRequestSubmit = this.onIngredientFilterRequestSubmit.bind(this);
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
      showFlavorFilterDialog: false,
      showIngredientFilterDialog: false,
    });
  }

  onAddIngredientDialogClosed() {
    this.setState({
      ingredientToAdd: newIngredient,
      showAddIngredientDialog: false,
    });
  }

  onFlavorTagRequestSubmit(tags) {
    const { user } = this.props;

    this.onCardViewClosed();

    if (user) this.props.searchRecipes(user, tags);
  }

  onIngredientFilterRequestSubmit(tag) {
    const { user } = this.props;

    this.onCardViewClosed();

    if (user) this.props.searchRecipes(user, tag, true);
  }

  onFilterButtonClicked() {
    this.setState({ showFlavorFilterDialog: true });
  }

  onIngredientFilterButtonClicked() {
    this.setState({ showIngredientFilterDialog: true });
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

  onFormFlavorTagDeleted(name) {
    let recipe = Object.assign({}, this.state.recipe);
    let { flavorTags } = recipe;
    let index = flavorTags.findIndex(x=> x === name);
    flavorTags.splice(index, 1);
    recipe.flavorTags = flavorTags;
    this.setState({
      recipe,
    });
    this.registerAllFlavorTags();
  }

  onFormFlavorTagAdded(value) {
    let recipe = Object.assign({}, this.state.recipe);
    let { flavorTags } = recipe;
    flavorTags.push(value);
    recipe.flavorTags = flavorTags;
    this.setState({
      recipe,
    });
    this.registerAllFlavorTags();
  }

  validateRecipe(recipe) {
    const {
      name,
      desc,
      instructions
    } = recipe;

    if (name === "") {
      this.props.notify(errorNotification("Recipe must have a name"));
      return false;
    }

    const isAlphaNumeric = !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name);

    if (!isAlphaNumeric) {
      this.props.notify(errorNotification("Recipe name must not contain special characters"));
      return false;
    }

    if (desc === "") {
      this.props.notify(errorNotification("Recipe must have a short description"));
      return false;
    }

    if (instructions === "") {
      this.props.notify(errorNotification("Recipe must have instructions"));
      return false;
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


    const valid = this.validateRecipe(recipe);

    if (!valid) return;
    
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

  addToHistory(recipe, isHistory) {
    let { user } = this.props;
    let { cookbook } = user;
    let { history } = cookbook;

    if (!isHistory){
      history.push(recipe);
    }
    else {
      const index = history.findIndex(x=> x.name === recipe.name);
      if (index != -1) {
        history.splice(index, 1);
      }
    }

    user = {
      ...user,
      cookbook: {
        ...cookbook,
        history,
      }
    };

    this.props.updateUser(user);
  }


  onCardActionClicked(recipeName, action, isDisabled, isFavorite, isHistory, needsOneMore) {
    const index = this.props.recipes.findIndex(x => x.name === recipeName);

    if (index == -1) return;

    let recipe = this.props.recipes[index];

    recipe = {
      ...recipe, 
      disabled: isDisabled,
      isFavorite: isFavorite,
      needsOneMoreIngredient: needsOneMore,
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
      case 'HISTORY':
        this.addToHistory(recipe, isHistory);
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
    const { favorites, history } = cookbook;

    let updatedRecipes = Object.assign([], recipes);

    let updatedRecommendedRecipe = Object.assign({}, recommendedRecipe)

    if (recommendedRecipe !== undefined && recommendedRecipe !== null) {
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
      if (searchResults) {
        index = searchResults.findIndex(x=> x.name === recommendedRecipe.name);
        if (index != -1) {
          searchResults.splice(index, 1);
        }
      }

      if (updatedRecipes) {
        index = updatedRecipes.findIndex(x=> x.name === recommendedRecipe.name);
        if (index != -1) {
          updatedRecipes.splice(index, 1);
        }
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

    if (Object.keys(updatedRecommendedRecipe).length > 0) {
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
        index = updatedRecipes.findIndex(x => x.name === remainingRecipe.name);
        if (index != -1) updatedRecipes.splice(index, 1);
        remainingRecipe = {
          ...remainingRecipe,
          isFavorite: true,
        }
        favoriteRemaining.push(remainingRecipe);
      }
    }

    const results = [
      ...updatedSearchResults,
      ...favoriteRemaining,
      ...updatedRecipes,
    ];


    const newResults = Object.assign([], results);
    for (i=0; i < results.length; i++) {
      const index = history.findIndex(x=> x.name === results[i].name);
      if (index != -1) {
        const historyRecipe = {
          ...results[i],
          isHistory: true,
        };
        newResults[i] = historyRecipe;
      }
    }

    return newResults;
  }

  /**
   * Generates a grid of specified size out of 
   * all recipe components available in the store.
   * @param  {Array} recipes List of recipes
   */
  getRecipesGrid(recipes) {
    recipes = this.processResults(recipes);

    let recipeItemComponents = [];

    for (var i = 0; i < recipes.length; i++) {
      const currentRecipe = recipes[i];

      let disabled = true;
      let isHistory = false;
      let isFavorite = false;
      let isRecommended = false;

      if (currentRecipe.recommended) isRecommended = true;

      if (currentRecipe.isHistory) isHistory = true;

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
              isHistory={isHistory}
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

    this.registerAllFlavorTags();
    
    if (user) this.props.searchRecipes(user, [""]);
    
    if (user && recommendedRecipe === null) {
      this.props.getRecommendedRecipes(user);
    }
  }

  registerAllFlavorTags() {
    const { recipes } = this.props;
    let flavors = [];
    for (var i = 0; i < recipes.length; i++) {
      flavors = [
        ...flavors,
        ...recipes[i].flavorTags,
      ];
    }
    flavors = Array.from(new Set(flavors));
    this.setState({ allFlavorTags: flavors });
  }

  render() {
    const { 
      recipe,
      allFlavorTags,
      showEditDialog, 
      showViewDialog, 
      showShareDialog,
      ingredientToAdd,
      filterMenuState,
      showFlavorFilterDialog,
      showAddIngredientDialog,
      showIngredientFilterDialog,
    } = this.state;

    const {
      open,
      hidden
    } = filterMenuState;

    const { 
      user,
      classes, 
      recipes,
      recipesRequestPending,
    } = this.props;

    let allIngredients = [];

    if (user.fridge.ingredients) allIngredients = user.fridge.ingredients;

    let recipesGrid = []; 

    if (recipes !== undefined && recipes !== null && recipes.length > 0) recipesGrid = this.getRecipesGrid(recipes);

    return (
        <div className={classes.content}>
          <Fab color="secondary" aria-label="Add" className={classes.fabAdd} onClick={this.onAddButtonClicked}>
            <AddIcon />
          </Fab>
          <Fab color="secondary" aria-label="Filter Flavours" className={classes.fabFilter} onClick={this.onFilterButtonClicked}>
            <StyleIcon />
          </Fab>
          <Fab color="secondary" aria-label="Filter Ingredients" className={classes.fabFilterMenu} onClick={this.onIngredientFilterButtonClicked}>
            <FilterListIcon />
          </Fab>
          {
            <FlavorTagSelectionDialog 
              flavorTags={allFlavorTags}
              open={showFlavorFilterDialog} 
              onClose={this.onCardViewClosed}
              onSubmit={this.onFlavorTagRequestSubmit}
            />
          }
          {
            <IngredientFilterSelectionDialog
              ingredients={allIngredients}
              open={showIngredientFilterDialog}
              onClose={this.onCardViewClosed}
              onSubmit={this.onIngredientFilterRequestSubmit}
            />
          }
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
              onFlavorTagAdded={this.onFormFlavorTagAdded}
              onIngredientAdded={this.onFormIngredientAdded}
              onFlavorTagDeleted={this.onFormFlavorTagDeleted}
              onIngredientDeleted={this.onFormIngredientDeleted}
            />
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
  fabAdd: {
    margin: 24,
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
  fabFilter: {
    marginBottom: 24,
    marginTop: 24,
    marginLeft: 24,
    marginRight: 96,
    position: 'fixed',
    bottom: 0,
    right: 0,
  },
  fabFilterMenu: {
    marginBottom: 24,
    marginTop: 24,
    marginLeft: 24,
    marginRight: 168,
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
  notify: (config) => dispatch(createNotification(config)),
  getRecommendedRecipes: (user) => dispatch(getRecommendedRecipes(user)),
  searchRecipes: (user, filters, isIng) => dispatch(searchRecipes(user, filters, isIng)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RecipesPageContainer));