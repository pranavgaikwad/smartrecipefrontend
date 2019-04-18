import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getShowcase } from '../../actions/showcase/showcase.actions';

import RecipeShowCaseCard from '../../components/cards/recipe-showcase-card.component';

class ShowcaseContainer extends Component {
  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    let { name } = params;
    name = name.split("+").join(" ");
    this.props.getShowcase(name);
  }

  render() { 
    const { classes, showCasePending, showCaseRecipe } = this.props;

    let recipe = { name: "", desc: "", instructions: "", ingredients: [], nutVal: {}, flavorTags: [] };

    if (showCaseRecipe) recipe = showCaseRecipe

    return (
      <main className={classes.main}>
        {
            showCasePending &&
            <CircularProgress className={classes.progress} thickness={4} size={72}/>
        }
        {
            !showCasePending &&
            <RecipeShowCaseCard recipe={recipe}/>
        }   
      </main>
    );
  }
}

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  progress: {
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    position: 'absolute',
  },
});

ShowcaseContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  showCaseRecipe: state.showCaseReducer.showCaseRecipe,
  showCasePending: state.showCaseReducer.showCasePending,
});

const mapDispatchToProps = dispatch => ({
  getShowcase: (name) => dispatch(getShowcase(name)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShowcaseContainer));