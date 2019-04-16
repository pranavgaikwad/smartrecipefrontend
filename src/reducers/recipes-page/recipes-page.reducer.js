import initialState from './initial.state';
import { actionsRecipes } from '../../utils/app.constants';

/**
 * Updates the recipes list in the state and brings the recommended recipe to the front
 * @param  {[Object]} recipes           Existing recipes
 * @param  {Object} recommendedRecipe   Recommended recipe
 * @return {[Object]}                     Recipes
 */
function registerRecommendedRecipe(recipes, recommendedRecipe) {
    let index = null;
    index = recipes.findIndex(x=> x.name === recommendedRecipe.name);
    if (index != -1) {
      recipes.splice(index, 1);
    }
    const recipe = {
      ...recommendedRecipe,
      recommended: true,
    };
    let updatedRecipes = [];
    if (recipe) updatedRecipes = [recipe, ...recipes];
    return updatedRecipes;
}

/**
 * Reducer responsible for handling actions performed on Recipes page
 * @param  {Object} state  Initial State to start 
 * @param  {Object} action Which action to perform
 * @return {Object}        New State 
 */
export default function recipesReducer(state = initialState, action = {}) {
 const { recipes, recommendedRecipes } = state;
 
 let recipe = null;
 let newRecipes = null;

 if (action.recipe) recipe = action.recipe;

 if (action.recipes) newRecipes = action.recipes;

 let updatedRecipes = [];

 const {  } = state;

 switch (action.type) {
    case actionsRecipes.add:
      recipes.push(action.recipe);
      
      if (recommendedRecipes.length > 0) {
        updatedRecipes = registerRecommendedRecipe(recipes, recommendedRecipes[0]);
      }
      
      return {
        ...state,
        recipes: updatedRecipes,
      };

    case actionsRecipes.get:
      if (recommendedRecipes.length > 0) {
        updatedRecipes = registerRecommendedRecipe(newRecipes, recommendedRecipes[0]);
      }
      return {
        ...state,
        recipes: updatedRecipes,
        isFailed: false,
        isPending: false,
      };

    case actionsRecipes.recommend:
      console.log("Recommending", recommendedRecipes);

      recommendedRecipes.push(recipe);
      updatedRecipes = registerRecommendedRecipe(recipes, recipe);
      return {
        ...state,
        recipes: updatedRecipes,
        isFailed: false,
        isPending: false,
        recommendedRecipes,
      };

    case actionsRecipes.update:
      let index = recipes.findIndex(x=> x.name === recipe.name);
      if (index != -1) {
        updatedRecipes = [
          ...state.recipes.slice(0, index),
          Object.assign({}, state.recipes[index], recipe),
          ...state.recipes.slice(index+1),
        ];   
      }
      return {
        ...state,
        recipes: updatedRecipes,
        isFailed: false,
        isPending: false,
      };

    case actionsRecipes.pending:
      return {
        ...state,
        isPending: true,
        isFailed: false,
      };

    case actionsRecipes.failed:
      return {
        ...state,
        isFailed: true,
        isPending: false,
      };

    default:
      return state;
  }
}
