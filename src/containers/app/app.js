import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Notify } from 'react-redux-notify';
import 'react-redux-notify/dist/ReactReduxNotify.css';
import { Route, Router, Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import { signOut } from '../../actions/auth/auth.actions';
import { navigateTo } from '../../actions/navigation/navigation.actions';

import MenuComponent from '../../components/menu/menu.component';
import HomePageComponent from '../home-page/home-page.component';
import { history, menuItemProps } from '../../utils/app.constants';
import RecipesPageContainer from '../recipes-page/recipes-page.component';
import ShowcaseContainer from '../showcase/showcase-container.component';
import IngredientsPageContainer from '../ingredients-page/ingredients-page.component';

import { 
  searchRecipes, 
} from '../../actions/recipes-page/recipes-page.actions';

const notificationStyles = {                  
    margin:'5px 0', 
    padding: '2px 5px', 
    border: '1px solid #333', 
    float:'right', 
    clear: 'right',
    width: '330px',
    boxSizing: 'border-box',
}

/**
 * Main entry point for the frontend application
 */
class App extends React.Component {
  
  /**
   * @param  {props}
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.onDrawerOpen = this.onDrawerOpen.bind(this);
    this.onDrawerClosed = this.onDrawerClosed.bind(this);
    this.onSignOutClicked = this.onSignOutClicked.bind(this);
    this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
    this.onSearchInputSubmit = this.onSearchInputSubmit.bind(this);
  }

  /**
   * When drawer is opened
   * @param  {object} e Event
   * @return {null}
   */
  onDrawerOpen(e) {
    this.setState({ open: true });
  }

  /**
   * When drawer is closed
   * @param  {object} e Event
   * @return {null}
   */
  onDrawerClosed(e) {
    this.setState({ open: false });
  }

  /**
   * Handles click on one of the menu items
   * @param  {string} link Link of the page to navigate to 
   * @return {null}      
   */
  onMenuItemClicked(link, title) {
    this.setState({ open: false });

    this.props.navigateTo(title);

    history.push(link);
  }

  /**
   * When user clicks Sign Out
   * @return {null} 
   */
  onSignOutClicked() {
    this.setState({ open: false });

    this.props.navigateTo(menuItemProps.recipesMenu.title);

    this.props.signOut();
  }

  /**
   * When user presses Enter key in the search bar, search request is made
   * @param  {Object} user  User who performed the request
   * @param  {String} value Query user put in the search bar
   * @return {null}       
   */
  performSearch(user, value) {
    this.props.searchRecipes(user, value.split());
  }

  /**
   * Handler to submit search query
   * @param  {Object} value 
   * @return {[type]}       [description]
   */
  onSearchInputSubmit(value) {
    const { user } = this.props;
    this.performSearch(user, value);
  }

  render() {
    const { 
      classes,
      currentRoute,
      isSignInFailed,  // eslint-disable-line
      isSignInSuccess, // eslint-disable-line
      isSignInPending, // eslint-disable-line
    } = this.props; 

    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Notify customStyles={notificationStyles} position="TopRight"/>
        {/* login page */}
        { 
          !isSignInSuccess &&
          <main className={classNames(classes.content, {[classes.contentShift]: open,})}>
              <Router history={history}>
                  <div>
                      <Route path={menuItemProps.loginMenu.route} exact component={props => <HomePageComponent/>}/>
                      <Route path={menuItemProps.showcase.route} component={props => <ShowcaseContainer {...props}/>}/> 
                  </div>
              </Router>
          </main> 
        }

        {/* navigation menu */}
        { 
          isSignInSuccess &&
          <MenuComponent
            open={open}
            title={currentRoute}
            onDrawerOpen={this.onDrawerOpen}
            onDrawerClosed={this.onDrawerClosed}
            onSignOutClicked={this.onSignOutClicked}
            onMenuItemClicked={this.onMenuItemClicked}
            onSearchInputSubmit={this.onSearchInputSubmit}
          />
        }

        
        {/* main content on the page */}
        {
          isSignInSuccess &&
          <main className={classNames(classes.content, {[classes.contentShift]: open,})}>
              <Router history={history}>
                  <div>
                      <Route path={menuItemProps.recipesMenu.route} component={props => <RecipesPageContainer/>}/> 
                      <Route path={menuItemProps.ingredientsMenu.route} component={props => <IngredientsPageContainer/>}/> 
                  </div>
              </Router>
          </main>
        }
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});


App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  isSignInPending: state.authReducer.isSignInPending,
  isSignInSuccess: state.authReducer.isSignInSuccess,
  isSignInFailed: state.authReducer.isSignInFailed,
  currentRoute: state.navigationReducer.currentRoute,
});


const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut()),
  navigateTo: (route) => dispatch(navigateTo(route)),
  searchRecipes: (user, filters) => dispatch(searchRecipes(user, filters)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(App));



