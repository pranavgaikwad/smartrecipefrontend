import { createNotification } from 'react-redux-notify';

import { apiProxy } from '../../utils/api-proxy.service';
import { apiConstants, actionsShowcase } from '../../utils/app.constants';

/**
 * Sets request as pending
 */
function setShowcasePending() {
  return { type: actionsShowcase.pending };
}

/**
 * Sets request as pending
 */
function setShowcaseFailed() {
  return { type: actionsShowcase.failed };
}

/**
 * Sets response
 */
function setShowcaseResponse(recipe) {
  return { type: actionsShowcase.get, recipe };
}

/**
 * Gets showcase recipe
 * @param  {String} name of the recipe to get    
 */
export function getShowcase(name) {
  const requestBody = {
    recipe: {
      name: name
    }
  }
  return (dispatch) => {
    dispatch(setShowcasePending());
    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.getShowcaseRecipe}`, requestBody, '123')
      .then((response) => {
        dispatch(setShowcaseResponse(response.recipe));
      })
      .catch((e) => { // eslint-disable-line
        dispatch(setShowcaseFailed());
      }
    );
  }
}