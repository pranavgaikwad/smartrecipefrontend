import { apiProxy } from '../../utils/api-proxy.service';
import { apiConstants } from '../../utils/app.constants';
import { actionsRecipes } from '../../utils/app.constants';

/**
 * Sets request as pending
 */
function setRequestPending() {
  return { type: actionsRecipes.pending };
}

/**
 * Sets request as failed
 */
function setRequestFailed() {
  return { type: actionsRecipes.failed };
}

/**
 * Populates redux store with list of recipes obtained from backend
 * @param  {[Object]} recipes List of recipes
 */
function get(recipes) {
  return { type: actionsRecipes.get, recipes };
}

/**
 * Populates redux store with list of recipes obtained from backend
 * @param  {[Object]} recipes List of recipes
 */
function add(recipe) {
  return { type: actionsRecipes.add, recipe };
}

/**
 * Populates redux store with recommended recipe
 * @param  {[Object]} Recommended recipe
 */
function recommend(recipe) {
  return { type: actionsRecipes.recommend, recipe };
}

function update(recipe) {
  return { type: actionsRecipes.update, recipe }; 
}

function search(recipes) {
  return { type: actionsRecipes.search, searchResults: recipes };
}

/**
 * Adds new recipe to the redux store
 * @param  {Object} recipe    Recipe to add
 * @return 
 */
export function addRecipe(recipe) {
  const requestBody = {
    recipe: recipe,
  };

  return (dispatch) => {
    dispatch(setRequestPending());
    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.addRecipe}`, requestBody, '123')
    .then((response) => {
      dispatch(add(response.recipe));      
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    })
  }
}

/**
 * Edits an existing recipe
 * @param  {Object} recipe    Recipe to edit
 * @return 
 */
export function editRecipe(recipe) {
  const requestBody = {
    recipe: recipe,
  };

  return (dispatch) => {
    dispatch(setRequestPending());
    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.editRecipe}`, requestBody, '123')
    .then((response) => {
      const { recipe } = response;
      dispatch(update(recipe));      
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    })
  }
}

/**
 * Get list of recipes
 * @return {[Object]} List of recipes
 */
export function getRecipes() {
  return (dispatch) => {
    dispatch(setRequestPending());

    apiProxy.get(`${apiConstants.baseUrl}${apiConstants.getRecipes}`, '123')
    .then((response) => {
      const { recipes } = response;
      if (recipes.length > 0) {
        dispatch(get(recipes));
      }
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    });
  };
}

/**
 * Get list of recipes
 * @return {[Object]} List of recipes
 */
export function getRecommendedRecipes(user) {
  const requestBody = {
    user: user,
  };  

  return (dispatch) => {
    dispatch(setRequestPending());

    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.getRecommendedRecipes}`, requestBody, '123')
    .then((response) => {
      let recipe = null;
      if (response.recipe) {
        recipe = response.recipe;
      }
      dispatch(recommend(recipe));
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    });
  };
}

/**
 * Delete a recipe
 * @param {Object} recipe 
 */
export function addToFavorite(user, recipe) {
  let requestBody = {
    user: user,
  }
  return (dispatch) => {
    dispatch(setRequestPending());

    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.favouriteRecipe}`, requestBody, '123')
    .then((response) => {
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    })
  };
}

/**
 * Delete a recipe
 * @param {Object} recipe 
 */
export function deleteRecipe(id) {
  return (dispatch) => {
    dispatch(setRequestPending());

    apiProxy.delete(`${apiConstants.baseUrl}${apiConstants.recipes}/${id}`, '123')
    .then((response) => {
      return apiProxy.get(`${apiConstants.baseUrl}${apiConstants.recipes}`, '123');
    })
    .then((response) => {
      dispatch(get(response));      
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    })
  };
}


export function searchRecipes(user, filters, isIngredientFilter) {
  let requestBody = {};

  if (isIngredientFilter) {
    requestBody = {
      user,
      ingredient: { name: filters },
    };
  } else {
    requestBody = {
      user,
      filters: filters,
    };
  }

  return (dispatch) => {
    dispatch(setRequestPending());

    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.searchRecipes}`, requestBody, '123')
    .then((response) => {
      const { recipes } = response;
      dispatch(search(recipes));
    })
    .catch((e) => { // eslint-disable-line
      dispatch(setRequestFailed());
    })
  };
}