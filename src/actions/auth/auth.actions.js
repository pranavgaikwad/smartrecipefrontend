import { createNotification } from 'react-redux-notify';

import { apiProxy } from '../../utils/api-proxy.service';
import { apiConstants } from '../../utils/app.constants';
import { actionsSignIn } from '../../utils/app.constants';
import { history, menuItemProps } from '../../utils/app.constants';
import { errorNotification } from '../../utils/notify.config'; 

/**
 * Sets request as pending
 */
function setSignInPending() {
  return { type: actionsSignIn.pending };
}

/**
 * Sets request as succeded
 */
function setSignInSuccess(user) {
  return { type: actionsSignIn.success, user: user };
}

/**
 * Sets request as failed
 */
function setSignInFailed() {
  return { type: actionsSignIn.failed };
}

/**
 * Creates new user
 * @param  {String} email    
 * @param  {String} password 
 */
export function signUp(user) {
  const requestBody = {
    user,
  }; 

  return (dispatch) => {
    dispatch(setSignInPending());
    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.signup}`, requestBody, '123')
      .then((response) => {
        dispatch(setSignInSuccess(response));
        history.push(menuItemProps.recipesMenu.route);
      })
      .catch((e) => { // eslint-disable-line
        dispatch(setSignInFailed());
        dispatch(createNotification(errorNotification("Sign up failed")));
      }
    );
  }
}

/**
 * Sign in existing user
 * @param  {object} Email
 * @param  {object} Password
 */
export function signIn(user) {
  const requestBody = {
    user,
  }; 

  return (dispatch) => {
    dispatch(setSignInPending());
    apiProxy.post(`${apiConstants.baseUrl}${apiConstants.signin}`, requestBody, '123')
      .then((response) => {
        console.log("Response : ", response);
        dispatch(setSignInSuccess(response));
        history.push(menuItemProps.recipesMenu.route);
      })
      .catch((e) => { // eslint-disable-line
        dispatch(setSignInFailed());
        dispatch(createNotification(errorNotification("Invalid username or password")));
      }
    );
  };
}


/**
 * Signs out user
 * @return
 */
export function signOut(email, password) {
  /**
   * @param {Boolean}
   */
  function setSignOut() {
    return { type: actionsSignIn.signout };
  }

  return (dispatch) => {
    dispatch(setSignOut());
  };
}