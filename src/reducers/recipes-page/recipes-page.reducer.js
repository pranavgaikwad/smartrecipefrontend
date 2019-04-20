import initialState from './initial.state';
import { actionsRecipes } from '../../utils/app.constants';
/* eslint-disable */
/**
 * Reducer responsible for handling actions performed on Recipes page
 * @param  {Object} state  Initial State to start 
 * @param  {Object} action Which action to perform
 * @return {Object}        New State 
 */
export default function recipesReducer(state = initialState, action = {}) {
 const { recipes, recommendedRecipe } = state;
 
 let recipe = null;
 let newRecipes = null;

 if (action.recipe) recipe = action.recipe;

 if (action.recipes) newRecipes = action.recipes;

 let updatedRecipes = [];

 const {  } = state;

 switch (action.type) {
    case actionsRecipes.add:
      console.log("Adding recipe ", action.recipe);
      return {
        ...state,
        recipes: [
          ...recipes,
          action.recipe,
        ],
      };

    case actionsRecipes.get:
      return {
        ...state,
        recipes: action.recipes,
        isFailed: false,
        isPending: false,
      };

    case actionsRecipes.recommend:
      return {
        ...state,
        isFailed: false,
        isPending: false,
        recommendedRecipe: recipe,
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

    case actionsRecipes.search:
      const { searchResults } = action;
      return {
        ...state,
        searchResults,
        isPending: false,
        isFailed: false,
      };

    case actionsRecipes.failed:
      return {
        ...state,
        isFailed: true,
        isPending: false,
      };

    case actionsRecipes.reset:
      return {
        ...state,
        searchResults: [],
        recipes: [],
        recommendedRecipe: null,
        isFailed: false,
        isPending: false,
      }

    default:
      return state;
  }
}
