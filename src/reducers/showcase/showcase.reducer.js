import initialState from './initial.state';
import { actionsShowcase } from '../../utils/app.constants';

/**
 * Reducer responsible for handling actions performed on showcase page
 * @param  {Object} state  Initial State to start 
 * @param  {Object} action Which action to perform
 * @return {Object}        New State 
 */
export default function showCaseReducer(state = initialState, action = {}) {
 switch (action.type) {
    case actionsShowcase.get:
      return {
        ...state,
        showCaseRecipe: action.recipe,
        showCaseFailed: false,
        showCasePending: false,
      };

    case actionsShowcase.pending:
      return {
        ...state,
        showCaseFailed: false,
        showCasePending: true,
      };

    case actionsShowcase.failed:
      return {
        ...state,
        showCaseFailed: true,
        showCasePending: false,
      };

    default:
      return state;
  }
}
